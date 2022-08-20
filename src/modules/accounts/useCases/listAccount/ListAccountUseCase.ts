import IAccountRepository from "../../repositories/IAccountRepository";
import Account from "../../models/Account";

interface IListParams {
  limit?: number;
  page?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  query?: {
    active?: boolean;
  }
}

class ListAccountUseCase {

  constructor(private accountRepository: IAccountRepository) {
  }

  execute(listParams: IListParams = {}): Promise<Account[]> {
    if (listParams.limit || listParams.sort || listParams.query) {
      return this.accountRepository.findWithParameters({
        limit: listParams.limit,
        offset: listParams.page,
        sort: listParams.sort,
        order: listParams.order,
        query: listParams.query
      })
    }

    return this.accountRepository.findAll();
  }


}

export default ListAccountUseCase;
