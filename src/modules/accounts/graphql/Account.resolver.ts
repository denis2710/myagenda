import ICreateAccountDTO from "../dtos/ICreateAccountDTO";
import AccountRepositoryPrisma from "../repositories/prisma/AccountRepositoryPrisma";
import CreateAccountUseCase from "../useCases/createAccount/CreateAccountUseCase";
import graphQLAppError from "../../../shared/errors/GraphqlAppErrror";
import ListAccountUseCase from "../useCases/listAccount/ListAccountUseCase";

const accountRepository = new AccountRepositoryPrisma();
const createAccountUseCase = new CreateAccountUseCase(accountRepository);
const listAccountUseCase = new ListAccountUseCase(accountRepository);

const AccountResolver = {
    account: async () => {
        try {
            return await listAccountUseCase.execute();

        } catch (e) {
            return graphQLAppError(e)
        }
    },
    createAccount: async (_: undefined, { data } : { data: ICreateAccountDTO }) => {
        const { username, email, password, confirmPassword } = data;

        try {
            const response = await createAccountUseCase.execute({
                username,
                email,
                password,
                confirmPassword,
            })

            return {
                __typename: 'CreateAccountResponseSuccess',
                ...response
            };

        } catch (e) {
            return graphQLAppError(e)
        }
    }

}

export default AccountResolver;