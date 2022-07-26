const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLList,
} = require('graphql')

//============== generate type of blog to return all fields of blog =============

exports.Blog_Type = new GraphQLObjectType({
  name: 'BlogType',
  description: 'this type for retreiving blogs',
  fields: {
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    price: { type: GraphQLInt },
    createdBy: { type: new GraphQLObjectType({
        name:"createdbyname",
        fields:{
            _id:{ type: GraphQLID },
            name:{ type: GraphQLString },
            email:{ type: GraphQLString },
        }
    })},
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
    picture: { type: new GraphQLList(GraphQLString) }
  }
})
