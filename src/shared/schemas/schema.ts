import {makeExecutableSchema} from "@graphql-tools/schema";
import typeDefs from "./accounts.graphql";

const resolvers = {
  Query: {
    accounts: () => [],
  }
}

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

