import {AppError} from "../../../../shared/errors/AppError";
import IAccountRepository from "../../repositories/IAccountRepository";

class DeleteAccountUseCase {

  constructor(private accountRepository: IAccountRepository) {
  }

  async execute(id: string): Promise<void> {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    await this.accountRepository.delete(id);
  }

}

export default DeleteAccountUseCase;
