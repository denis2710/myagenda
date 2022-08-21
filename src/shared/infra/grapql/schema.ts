import 'graphql-import-node';
import {makeExecutableSchema} from "@graphql-tools/schema";
import {loadFiles} from "@graphql-tools/load-files";
import AccountResolver from "../../../modules/accounts/graphql/Account.resolver";


const createSchema = async () => {
    const typeDefs =  await loadFiles(  './src/**/*.graphql');

    const resolvers = {
        Query: {
            account: AccountResolver.account
        },

        Mutation: {

        }
    }

     return makeExecutableSchema({
        typeDefs,
        resolvers,
    })
}



export default createSchema