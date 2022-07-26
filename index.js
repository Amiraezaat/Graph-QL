const express = require('express')
require("dotenv").config()
const connectionDB = require('./DB/connection')
const app = express()
const port = process.env.PORT
const { graphqlHTTP } = require('express-graphql')
const User_Router_Reset = require('./Modules/User/Reset_APIs_Controller/User.routes')
const { UserQL_schema } = require('./Modules/User/GraphQl_Controller/userQL_schema')
const { BlogQL_schema } = require('./Modules/Blog/GraphQl_Controller/blogQL_schema')


app.use(express.json())

connectionDB()
app.use(User_Router_Reset)

// graph ql router for User APIs 
app.use(
  '/userAPI',
  graphqlHTTP({
    schema: UserQL_schema  , // the structure of the graphql
    graphiql: true // the GUI that help me to test the graphql apis
  })
)

// graph ql router for Blog APIs 
app.use(
  '/blogAPI',
  graphqlHTTP({
    schema: BlogQL_schema, // the structure of the graphql
    graphiql: true // the GUI that help me to test the graphql apis
  })
)

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`app listening on port ${port}!`))
