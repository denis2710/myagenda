import {makeExecutableSchema} from "@graphql-tools/schema";

const typeDefs = `  
    type Query {
      info: String!
    }
`

const resolvers = {
    Query: {
        info: () => 'My Agenda API uses GraphQL'
    }
}

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
})

export default schema