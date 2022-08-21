import express from 'express'
import graphQLRoute from "../graphql/graphQLRoute";

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('My Agenda API uses GraphQL')
})

app.use('/graphql', graphQLRoute)

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
