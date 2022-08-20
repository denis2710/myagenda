import Account from "../../models/Account";
import IAccountRepository, {IQueryParams} from "../IAccountRepository";


class AccountRepositoryInMemory implements IAccountRepository {

  database: Account[] = []

  async create(account: Account): Promise<void> {
    this.database.push(account)
  }

  async delete(id: string): Promise<void> {
    const accountIndex = this.database.findIndex(a => a.id === id)

    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    this.database.splice(accountIndex, 1)
  }

  async update(account: Account): Promise<void> {
    const accountIndex = this.database.findIndex(a => a.id === account.id)

    if (accountIndex === -1) {
      throw new Error("Account not found")
    }

    this.database[accountIndex] = account

  }

  async findAll(): Promise<Account[]> {
    return this.database
  }

  async findWithParameters(queryParams: IQueryParams): Promise<Account[]> {
    let accountsFiltered = [...this.database]

    if (queryParams.query) {
      const findActive = queryParams.query.active

      if (findActive) {
        accountsFiltered = accountsFiltered.filter(account => account.active)
      } else {
        accountsFiltered = accountsFiltered.filter(account => !account.active)
      }
    }

    if (queryParams.sort) {
      accountsFiltered.sort((a, b) => {
        if (queryParams.order === 'asc' || queryParams.order === undefined) {
          return a[queryParams.sort] > b[queryParams.sort] ? 1 : -1
        }

        if (queryParams.order === 'desc') {
          return a[queryParams.sort] < b[queryParams.sort] ? 1 : -1
        }

        return 0
      })
    }

    if (queryParams.limit && queryParams.offset) {
      const start = queryParams.limit * (queryParams.offset - 1)
      const end = start + queryParams.limit
      accountsFiltered = accountsFiltered.slice(start, end)
    }

    return accountsFiltered
  }

  async findById(id: string): Promise<Account> {
    return this.database.find(account => account.id === id)
  }

  async findByEmail(email: string): Promise<Account> {
    return this.database.find(account => account.email === email)
  }

  async findByUsername(username: string): Promise<Account | undefined> {
    return this.database.find(account => account.username === username)
  }

}

export default AccountRepositoryInMemory;
