import AccountRepositoryInMemory from "../../repositories/in-memory/AccountRepositoryInMemory";
import IAccountRepository from "../../repositories/IAccountRepository";
import CreateAccountUseCase from "../createAccount/CreateAccountUseCase";
import ICreateAccountDTO from "../../dtos/ICreateAccountDTO";
import UpdateAccountUseCase from "./UpdateAccountUseCase";
import Account from "../../models/Account";
import {AppError} from "../../../../shared/errors/AppError";

let accountRepository: IAccountRepository;
let createAccountUseCase: CreateAccountUseCase;
let updateAccountUseCase: UpdateAccountUseCase;
let accountToCreate: ICreateAccountDTO;
let accountToUpdate: Account;

describe('Update Account', () => {

  beforeEach(async () => {
    accountRepository = new AccountRepositoryInMemory()
    createAccountUseCase = new CreateAccountUseCase(accountRepository)
    updateAccountUseCase = new UpdateAccountUseCase(accountRepository);

    accountToCreate = {
      username: 'fakeUserName',
      userEmail: 'fakeUser@email.com',
      userPassword: 'F4k3#U$3r#P4$$w0rd',
      userConfirmPassword: 'F4k3#U$3r#P4$$w0rd',
    }

    const createAccountResponse = await createAccountUseCase.execute(accountToCreate)


    accountToUpdate = new Account({...createAccountResponse.account, password: accountToCreate.userPassword})
  })

  it('should update a account username', async () => {

    accountToUpdate.username = 'newUsername';

    await updateAccountUseCase.execute(accountToUpdate)

    const accountUpdated = await accountRepository.findById(accountToUpdate.id)

    expect(accountUpdated.username).toBe(accountToUpdate.username)
  })

  it('should not update data not informed', async () => {

    accountToUpdate.username = undefined;
    accountToUpdate.password = '';
    accountToUpdate.active = undefined;

    await updateAccountUseCase.execute(accountToUpdate)

    const accountUpdated = await accountRepository.findById(accountToUpdate.id)

    expect(accountUpdated.username).toBe(accountToCreate.username)
    expect(accountUpdated.email).toBe(accountToCreate.userEmail)
    expect(accountUpdated.password).toBe(accountToUpdate.password)
    expect(accountUpdated.active).toBe(true)

  })


  it('should update account email', async () => {
    accountToUpdate.email = 'newEmail@mail.com';

    await updateAccountUseCase.execute(accountToUpdate)

    const accountUpdated = await accountRepository.findById(accountToUpdate.id)

    expect(accountUpdated.email).toBe(accountToUpdate.email)
  })

  it('should update account password', async () => {
    accountToUpdate.password = 'newPassword';

    await updateAccountUseCase.execute(accountToUpdate)

    const accountUpdated = await accountRepository.findById(accountToUpdate.id)

    expect(accountUpdated.comparePassword('newPassword')).toBe(true)
  })

  it('should not update account password to a weak password', async () => {
    accountToUpdate.password = 'newPassword';

    await updateAccountUseCase.execute(accountToUpdate)

    const accountUpdated = await accountRepository.findById(accountToUpdate.id)

    expect(accountUpdated.password).toBe(accountToUpdate.password)
  })


  it('should update account active', async () => {
    accountToUpdate.active = false;

    await updateAccountUseCase.execute(accountToUpdate)

    const accountUpdated = await accountRepository.findById(accountToUpdate.id)

    expect(accountUpdated.active).toBe(accountToUpdate.active)
  })

  it('should update a account email', async () => {

    accountToUpdate.email = 'newEmail@email.com';

    await updateAccountUseCase.execute(accountToUpdate)

    const accountUpdated = await accountRepository.findById(accountToUpdate.id)

    expect(accountUpdated.email).toBe(accountToUpdate.email)
  })

  it('should not update a account email to an invalid email', async () => {

    accountToUpdate.email = 'invalideEmail';

    await expect(async () => {
      await updateAccountUseCase.execute(accountToUpdate)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await updateAccountUseCase.execute(accountToUpdate)
    } catch (e) {
      expect(e.message).toBe('Email is invalid')
      expect(e.statusCode).toBe(400)
    }
  })

  it('should not update a account email to other existent email', async () => {

    accountToCreate = {
      username: 'fakeUserName',
      userEmail: 'otherAccountEmail@email.com',
      userPassword: 'F4k3#U$3r#P4$$w0rd',
      userConfirmPassword: 'F4k3#U$3r#P4$$w0rd',
    }

    await createAccountUseCase.execute(accountToCreate)


    accountToUpdate.email = 'otherAccountEmail@email.com';

    await expect(async () => {
      await updateAccountUseCase.execute(accountToUpdate)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await updateAccountUseCase.execute(accountToUpdate)
    } catch (e) {
      expect(e.message).toBe('Email already exists')
      expect(e.statusCode).toBe(400)
    }
  })

  it('should not update a account username to other existent username', async () => {

    accountToCreate = {
      username: 'otherAccountUsername',
      userEmail: 'otherAccountEmail@email.com',
      userPassword: 'F4k3#U$3r#P4$$w0rd',
      userConfirmPassword: 'F4k3#U$3r#P4$$w0rd',
    }

    await createAccountUseCase.execute(accountToCreate)


    accountToUpdate.username = 'otherAccountUsername';

    await expect(async () => {
      await updateAccountUseCase.execute(accountToUpdate)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await updateAccountUseCase.execute(accountToUpdate)
    } catch (e) {
      expect(e.message).toBe('Username already exists')
      expect(e.statusCode).toBe(400)
    }
  })


  it('should return an error if the account does not exist', async () => {
    accountToUpdate.id = 'fakeId';

    await expect(async () => {
      await updateAccountUseCase.execute(accountToUpdate)
    }).rejects.toBeInstanceOf(AppError)

    try {
      await updateAccountUseCase.execute(accountToUpdate)
    } catch (e) {
      expect(e.message).toBe('Account does not exist')
      expect(e.statusCode).toBe(404)
    }

  });

})
