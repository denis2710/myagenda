import Account from "../models/Account";

export interface IQueryParams {
  limit?: number;
  offset?: number;
  order?: 'asc' | 'desc';
  query?: { active?: boolean };
  sort?: string;
}

interface IAccountRepository {
  create(user: Account): Promise<void>;

  delete(id: string): Promise<void>;

  update(user: Account): Promise<void>;

  findAll(): Promise<Account[]>;

  findWithParameters(queryParams: IQueryParams): Promise<Account[]>;

  findById(id: string): Promise<Account | undefined>;

  findByEmail(email: string): Promise<Account | undefined>;

  findByUsername(username: string): Promise<Account | undefined>;

}

export default IAccountRepository;
