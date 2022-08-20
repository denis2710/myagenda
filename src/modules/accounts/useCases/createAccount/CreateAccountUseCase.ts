import ICreateAccountDTO from "../../dtos/ICreateAccountDTO";
import IAccountRepository from "../../repositories/IAccountRepository";
import Account from "../../models/Account";
import {validateEmail} from "../../../../shared/utils/validateEmail";
import {AppError} from "../../../../shared/errors/AppError";
import {generateAccountToken} from "../../shared/utils/generateAccountToken";

export interface ICreateAccountUseCaseResponse {
  account: {
    id: string;
    username: string;
    email: string;
  };
  token: string;
}


class CreateAccountUseCase {

  constructor(private accountRepository: IAccountRepository) {
  }


  async execute(account: ICreateAccountDTO): Promise<ICreateAccountUseCaseResponse> {

    const {username, userEmail, userPassword, userConfirmPassword} = account;

    await this.doCreateAccountValidations(username, userEmail, userPassword, userConfirmPassword);
    
    const newAccount = new Account({
      id: undefined,
      username,
      email: userEmail,
      password: userPassword,
      active: true,
    })

    await this.accountRepository.create(newAccount);

    const token = generateAccountToken(newAccount);


    return {
      account: {
        id: newAccount.id,
        email: newAccount.email,
        username: newAccount.username,
      },
      token
    }


  }

  async doCreateAccountValidations(username: string, userEmail: string, userPassword: string, userPasswordConfirmation: string): Promise<void> {
    const isValidEmail = validateEmail(userEmail);
    if (!isValidEmail) {
      throw new AppError('Account email is invalid', 400);
    }

    if (!username) {
      throw new AppError('Username is invalid', 400);
    }

    const userAlreadyExists = await this.accountRepository.findByEmail(userEmail);


    if (userAlreadyExists) {
      throw new AppError('Account already exists', 409);
    }

    if (!userPassword) {
      throw new AppError('Account password is invalid', 400);
    }

    if (userPassword !== userPasswordConfirmation) {
      throw new AppError('Account password not match with confirmation password', 400);
    }

    if (!this.validatePasswordStrength(userPassword)) {
      throw new AppError('Account password is not strong enough', 400);
    }


  }

  /**
   * Password must be:
   *    The password is at least 8 characters long (?=.{8,}).
   *    The password has at least one uppercase letter (?=.*[A-Z]).
   *    The password has at least one lowercase letter (?=.*[a-z]).
   *    The password has at least one digit (?=.*[0-9]).
   *    The password has at least one special character ([^A-Za-z0-9]).
   * @param password
   */
  validatePasswordStrength(password: string): boolean {
    const re = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/
    return re.test(String(password));
  }

}


export default CreateAccountUseCase;
