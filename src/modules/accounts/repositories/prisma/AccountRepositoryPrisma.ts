import IAccountRepository, {IQueryParams} from "../IAccountRepository";
import Account from "../../models/Account";
import prisma from "../../../../shared/infra/database/prisma";

class AccountRepositoryPrisma implements  IAccountRepository{
    async create(user: Account): Promise<void> {
        await prisma.account.create({
            data: {
                username: user.username,
                email: user.email,
                password: user.password,
            }
        })
        return Promise.resolve(undefined);

    }

    delete(id: string): Promise<void> {
        return Promise.resolve(undefined);
    }

    async findAll(): Promise<Account[]> {
        const listAccounts: Account[] = []
        const accounts = await prisma.account.findMany();

        accounts.map(account => {
          listAccounts.push(new Account(account))
        })

        return listAccounts;
    }

    async findByEmail(email: string): Promise<Account | undefined> {
        const account = await prisma.account.findUnique({ where: { email }});

        if(account){
            return new Account(account);
        }
    }

    async findById(id: string): Promise<Account | undefined> {
        const account = await prisma.account.findUnique({where: {id}});

        if (account) {
            return new Account(account);
        }
    }

    async findByUsername(username: string): Promise<Account | undefined> {
        const account = await prisma.account.findUnique({where: {username}});

        if (account) {
            return new Account(account);
        }

    }

    findWithParameters(queryParams: IQueryParams): Promise<Account[]> {
        return Promise.resolve([]);
    }

    update(user: Account): Promise<void> {
        return Promise.resolve(undefined);
    }


}

export default AccountRepositoryPrisma;