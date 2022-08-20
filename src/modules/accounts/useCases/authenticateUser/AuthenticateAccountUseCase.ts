import Account from "../../models/Account";
import {AppError} from "../../../../shared/errors/AppError";
import IAccountRepository from "../../repositories/IAccountRepository";

interface IAuthenticateAccountResponse {
  token: string;
  account: Account;
}

class AuthenticateAccountUseCase {
  constructor(private accountRepository: IAccountRepository) {
  }

  async execute(authentication: IAuthenticateAccountDTO): Promise<IAuthenticateAccountResponse> {
    const {userEmail, password} = authentication;

    const account = await this.accountRepository.findByEmail(userEmail);

    if (!account) {
      throw new AppError('Account or password is invalid', 401);
    }

    const isPasswordValid = account.comparePassword(password);
    if (!isPasswordValid) {
      throw new AppError('Account or password is invalid', 401);
    }

    if (!account.active) {
      throw new AppError('Account is not active', 401);
    }

    const token = account.generateToken();

    return {
      token,
      account
    }

  }


}

export default AuthenticateAccountUseCase;
