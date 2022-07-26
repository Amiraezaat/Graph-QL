const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean
} = require('graphql')

//============== generate type of user to return all fields of user =============
const userType = new GraphQLObjectType({
  name: 'UserTypeName',
  description: 'User Type description',
  fields: {
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    role: { type: GraphQLString },
    confirmed: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString }
  }
})

//===============generate new type that returned only in sign in API =============
const loginResType = new GraphQLObjectType({
  name: 'signInResponse',
  description: 'Token included',
  fields: {
    message: { type: GraphQLString },
    token: { type: GraphQLString }
  }
})

module.exports = { userType, loginResType }
