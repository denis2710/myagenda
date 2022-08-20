import ICreateAccountDTO from "../../dtos/ICreateAccountDTO";
import CreateAccountUseCase, {ICreateAccountUseCaseResponse} from "../createAccount/CreateAccountUseCase";
import IAccountRepository from "../../repositories/IAccountRepository";
import {verify} from "jsonwebtoken";
import AccountRepositoryInMemory from "../../repositories/in-memory/AccountRepositoryInMemory";
import AuthenticateAccountUseCase from "./AuthenticateAccountUseCase";
import {AppError} from "../../../../shared/errors/AppError";
import UpdateAccountUseCase from "../updateAccout/UpdateAccountUseCase";
import Account from "../../models/Account";


let authentication: IAuthenticateAccountDTO;
let account: ICreateAccountDTO
let accountSavedId: string;
let createAccountUseCase: CreateAccountUseCase;
let authenticateAccountUseCase: AuthenticateAccountUseCase;
let updateAccountUseCase: UpdateAccountUseCase;
let accountRepository: IAccountRepository;
let createAccountResponse: ICreateAccountUseCaseResponse;

describe('AuthenticateAccountUseCase', () => {

  beforeAll(async () => {

    accountRepository = new AccountRepositoryInMemory()
    createAccountUseCase = new CreateAccountUseCase(accountRepository);
    authenticateAccountUseCase = new AuthenticateAccountUseCase(accountRepository);
    updateAccountUseCase = new UpdateAccountUseCase(accountRepository);

    account = {
      username: 'fakeUserName',
      userEmail: 'fakeUser@email.com',
      userPassword: 'F4k3#U$3r#P4$$w0rd',
      userConfirmPassword: 'F4k3#U$3r#P4$$w0rd',
    }

    createAccountResponse = await createAccountUseCase.execute(account);
    accountSavedId = createAccountResponse.account.id;

    authentication = {
      userEmail: account.userEmail,
      password: account.userPassword,
    }
  })

  it('should return a valid token if credentials are valid and user is active', async () => {
    const {token, account} = await authenticateAccountUseCase.execute(authentication);

    const secretKey = process.env.JWT_KEY

    const {exp, sub} = verify(token, secretKey) as { sub: string, exp: number }

    const expirationDatetimeInSeconds = exp * 1000

    expect(sub).toBe(accountSavedId)
    expect(accountSavedId).toBe(account.id)
    expect(Date.now() < expirationDatetimeInSeconds).toBe(true)
  })

  it('should return an error if credentials are invalid', async () => {
    const wrongAuthentication = {...authentication, password: 'wrongPassword'}

    await expect(async () => {
      await authenticateAccountUseCase.execute(wrongAuthentication);
    }).rejects.toBeInstanceOf(AppError)

    try {
      await authenticateAccountUseCase.execute(wrongAuthentication)
    } catch (e) {
      expect(e.message).toBe('Account or password is invalid')
      expect(e.statusCode).toBe(401)
    }
  });
  
  it('should return an error if user does not exist', async () => {
    const wrongAuthentication = {...authentication, userEmail: 'otherEmail@email.com'}

    await expect(async () => {
      await authenticateAccountUseCase.execute(wrongAuthentication);
    }).rejects.toBeInstanceOf(AppError)

    try {
      await authenticateAccountUseCase.execute(wrongAuthentication)
    } catch (e) {
      expect(e.message).toBe('Account or password is invalid')
      expect(e.statusCode).toBe(401)
    }
  })
  it('should return an error if user is not active', async () => {
    const newAccount = new Account(createAccountResponse.account)

    newAccount.active = false
    await updateAccountUseCase.execute(newAccount)

    await expect(async () => {
      await authenticateAccountUseCase.execute(authentication);
    }).rejects.toBeInstanceOf(AppError)

    try {
      await authenticateAccountUseCase.execute(authentication)
    } catch (e) {
      expect(e.message).toBe('Account is not active')
      expect(e.statusCode).toBe(401)
    }
  });

})
