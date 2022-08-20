import AccountRepositoryInMemory from "../../repositories/in-memory/AccountRepositoryInMemory";
import CreateAccountUseCase from "../createAccount/CreateAccountUseCase";
import IAccountRepository from "../../repositories/IAccountRepository";
import ICreateAccountDTO from "../../dtos/ICreateAccountDTO";
import DeleteAccountUseCase from "./DeleteAccountUseCase";
import {AppError} from "../../../../shared/errors/AppError";

let createAccountUseCase: CreateAccountUseCase;
let deleteAccountUseCase: DeleteAccountUseCase;
let accountRepository: IAccountRepository;
let newAccount: ICreateAccountDTO;
let accountId: string;

describe('Delete account', function () {


  beforeEach(async () => {
    accountRepository = new AccountRepositoryInMemory()
    createAccountUseCase = new CreateAccountUseCase(accountRepository);
    deleteAccountUseCase = new DeleteAccountUseCase(accountRepository);

    newAccount = {
      username: 'fakeUserName',
      userEmail: 'fakeUser@email.com',
      userPassword: 'F4k3#U$3r#P4$$w0rd',
      userConfirmPassword: 'F4k3#U$3r#P4$$w0rd',
    }

    const createAccountResponse = await createAccountUseCase.execute(newAccount)
    accountId = createAccountResponse.account.id
  })

  it('should delete an account', async () => {
    await deleteAccountUseCase.execute(accountId)

    const accountDeleted = await accountRepository.findById(accountId)

    expect(accountDeleted).toBeUndefined()
  });
  it('should return an error if the account does not exist', async () => {

    await expect(async () => {
      await deleteAccountUseCase.execute('fakeId')
    }).rejects.toBeInstanceOf(AppError)

    try {
      await deleteAccountUseCase.execute('fakeId')
    } catch (e) {
      expect(e.message).toBe('Account not found')
      expect(e.statusCode).toBe(404)
    }
  });
});
