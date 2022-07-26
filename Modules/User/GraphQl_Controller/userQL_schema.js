const { GraphQLString,  GraphQLObjectType, GraphQLSchema } = require("graphql")
const { adduser, signIn, getAllUsers, update_user, deleteUser, send_code, Reset_password } = require("./userQL_controller")




//================  Generate the schema of User APIs =================
exports.UserQL_schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'UserQueryType',
      description:"this query for any get method apis" ,
      fields: {
        hello: {
          type: GraphQLString,
          resolve: () => {
            return 'GraphQL Works'
          }
        },
        User_List:getAllUsers
      }
    }),
    mutation: new GraphQLObjectType({
      name: 'UserMutation',
      description: 'this mutation for any post method apis',
      fields: {
        helloBool: {
          type: GraphQLString,
          resolve: () => {
            return "GraphQl mutation works"
          }
        },
        adduser: adduser,
        signIn: signIn,
        update_user: update_user,
        deleteUser: deleteUser,
        send_code: send_code,
        Reset_password: Reset_password
      }
    })
})