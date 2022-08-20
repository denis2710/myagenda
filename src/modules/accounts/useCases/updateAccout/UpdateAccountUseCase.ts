import Account from "../../models/Account";
import IAccountRepository from "../../repositories/IAccountRepository";
import {AppError} from "../../../../shared/errors/AppError";
import {validateEmail} from "../../../../shared/utils/validateEmail";

class UpdateAccountUseCase {

  constructor(private accountRepository: IAccountRepository) {
  }

  async execute(account: Account): Promise<Account> {
    const accountSaved = await this.accountRepository.findById(account.id);

    if (!accountSaved) {
      throw new AppError('Account does not exist', 404);
    }

    if (account.email !== accountSaved.email) {
      const accountWithEmail = await this.accountRepository.findByEmail(account.email);
      if (accountWithEmail) {
        throw new AppError('Email already exists', 400);
      }
    }

    if (account.username !== accountSaved.username) {
      const accountWithUsername = await this.accountRepository.findByUsername(account.username);
      if (accountWithUsername) {
        throw new AppError('Username already exists', 400);
      }
    }

    if (!validateEmail(account.email)) {
      throw new AppError('Email is invalid', 400);
    }

    if (!account.username || account.username.trim().length === 0) {
      account.username = accountSaved.username;
    }

    if (!account.password || account.password.trim().length === 0) {
      account._password = accountSaved._password
    }

    if (account.active === undefined) {
      account.active = accountSaved.active;
    }

    account.createdAt = accountSaved.createdAt;
    account.updatedAt = new Date();

    await this.accountRepository.update(account);

    return account;
  }
}

export default UpdateAccountUseCase;
