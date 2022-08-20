import CreateAccountUseCase from './CreateAccountUseCase';
import ICreateAccountDTO from "../../dtos/ICreateAccountDTO";
import AccountRepositoryInMemory from "../../repositories/in-memory/AccountRepositoryInMemory";
import IAccountRepository from "../../repositories/IAccountRepository";
import {validate as uuidValidate} from 'uuid';
import {AppError} from "../../../../shared/errors/AppError";
import {verify} from "jsonwebtoken";

let createAccountUseCase: CreateAccountUseCase;
let accountRepository: IAccountRepository;
let newAccount: ICreateAccountDTO;

describe('Create Account', () => {

  beforeEach(() => {
    accountRepository = new AccountRepositoryInMemory()
    createAccountUseCase = new CreateAccountUseCase(accountRepository);

    newAccount = {
      username: 'fakeUserName',
      userEmail: 'fakeUser@email.com',
      userPassword: 'F4k3#U$3r#P4$$w0rd',
      userConfirmPassword: 'F4k3#U$3r#P4$$w0rd',
    }
  })


  it('should create a account', async () => {
    await createAccountUseCase.execute(newAccount)

    const accountSaved = await accountRepository.findByEmail(newAccount.userEmail)

    expect(accountSaved.username).toBe(newAccount.username)
    expect(accountSaved.email).toBe(newAccount.userEmail)
  });

  it('should received a valid uuid when create a account', async () => {
    await createAccountUseCase.execute(newAccount)

    const accountSaved = await accountRepository.findByEmail(newAccount.userEmail)

    expect(accountSaved).toHaveProperty('id')
    expect(uuidValidate(accountSaved.id)).toBe(true)
  })

  it('should throws an error if the account username already exists', async () => {
    await createAccountUseCase.execute(newAccount)

    await expect(async () => {
      await createAccountUseCase.execute(newAccount)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createAccountUseCase.execute(newAccount)
    } catch (e) {
      expect(e.message).toBe('Account already exists')
      expect(e.statusCode).toBe(409)
    }

  });
  it('should return an error if the account username is not provided', async () => {
    const newAccountInvalid = {...newAccount}

    newAccountInvalid.username = ''

    await expect(async () => {
      await createAccountUseCase.execute(newAccountInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createAccountUseCase.execute(newAccountInvalid)
    } catch (e) {
      expect(e.message).toBe('Username is invalid')
      expect(e.statusCode).toBe(400)
    }
  });

  it('should return an error if the account userEmail is invalid', async () => {
    const newAccountInvalid = {...newAccount}

    newAccountInvalid.userEmail = 'invalidEmail'

    await expect(async () => {
      await createAccountUseCase.execute(newAccountInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createAccountUseCase.execute(newAccountInvalid)
    } catch (e) {
      expect(e.message).toBe('Account email is invalid')
      expect(e.statusCode).toBe(400)
    }
  });
  it('should return an error if the account email is not provided', async () => {
    const newAccountInvalid = {...newAccount}

    delete newAccountInvalid.userEmail

    await expect(async () => {
      await createAccountUseCase.execute(newAccountInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createAccountUseCase.execute(newAccountInvalid)
    } catch (e) {
      expect(e.message).toBe('Account email is invalid')
      expect(e.statusCode).toBe(400)
    }
  })
  it('should return an error if the account email is empty string', async () => {
    const newAccountInvalid = {...newAccount}

    newAccountInvalid.userEmail = ''

    await expect(async () => {
      await createAccountUseCase.execute(newAccountInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createAccountUseCase.execute(newAccountInvalid)
    } catch (e) {
      expect(e.message).toBe('Account email is invalid')
      expect(e.statusCode).toBe(400)
    }
  })

  it('should return an error if the account password is not provided', async () => {
    const newAccountInvalid = {...newAccount}

    delete newAccountInvalid.userPassword

    await expect(async () => {
      await createAccountUseCase.execute(newAccountInvalid)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await createAccountUseCase.execute(newAccountInvalid)
    } catch (e) {
      expect(e.message).toBe('Account password is invalid')
      expect(e.statusCode).toBe(400)
    }
  })
  it('should return an error if the account password do not match with account password confirmation', async () => {
    const newAccountInvalid = {...newAccount}

    newAccountInvalid.userConfirmPassword = 'invalidPassword'

    await expect(async () => {
      await createAccountUseCase.execute(newAccountInvalid)
    }).rejects.toBeInstanceOf(AppError);

    try {
      await createAccountUseCase.execute(newAccountInvalid)
    } catch (e) {
      expect(e.message).toBe('Account password not match with confirmation password')
      expect(e.statusCode).toBe(400)
    }
  });
  it('should return an error if the account password do is not strong enough', async () => {
    const newAccountInvalid = {...newAccount}

    newAccountInvalid.userPassword = 'weekPassword'
    newAccountInvalid.userConfirmPassword = 'weekPassword'

    await expect(async () => {
      await createAccountUseCase.execute(newAccountInvalid)
    }).rejects.toBeInstanceOf(AppError);

    try {
      await createAccountUseCase.execute(newAccountInvalid)
    } catch (e) {
      expect(e.message).toBe('Account password is not strong enough')
      expect(e.statusCode).toBe(400)
    }
  });
  it('should encrypt the account password', async () => {
    await createAccountUseCase.execute(newAccount)

    const accountSaved = await accountRepository.findByEmail(newAccount.userEmail)

    expect(accountSaved.password).not.toBe(newAccount.userPassword)
  });

  it('should return a valid token when user is created', async () => {
    const {token} = await createAccountUseCase.execute(newAccount)
    const secretKey = process.env.JWT_KEY

    expect(() => verify(token, secretKey)).not.toThrow()
  });

  it('should return a token with expiration date valid', async () => {
    const {token} = await createAccountUseCase.execute(newAccount)
    const secretKey = process.env.JWT_KEY

    const {exp} = verify(token, secretKey) as { sub: string, exp: number }


    const expirationDatetimeInSeconds = exp * 1000;

    expect(Date.now() < expirationDatetimeInSeconds).toBe(true)
  });

  it('should return a token with account id information', async () => {
    const {token} = await createAccountUseCase.execute(newAccount)
    const secretKey = process.env.JWT_KEY

    const {sub} = verify(token, secretKey) as { sub: string, exp: number }
    const accountSaved = await accountRepository.findByEmail(newAccount.userEmail)

    expect(sub).toBe(accountSaved.id)
  });

  it('should set active account as true when create a new account', async () => {
    await createAccountUseCase.execute(newAccount)

    const accountSaved = await accountRepository.findByEmail(newAccount.userEmail)

    expect(accountSaved.active).toBe(true)

  })

})
