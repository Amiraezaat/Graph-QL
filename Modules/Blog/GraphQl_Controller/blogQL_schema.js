const {
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema,
} = require('graphql')
 
const { addBlog, update_blog, deleteBlog, getAllBlogs, getBlogByID } = require('./blogQL_controller')
 
//================  Generate the schema of Blog APIs =================
exports.BlogQL_schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'BlogQuery',
    description: 'Blog Query works',
    fields: {
      hello_blog: {
        type: GraphQLString,
        resolve: () => {
          return 'Blog query workd'
        }
      },
      getAllBlogs: getAllBlogs

    }
  }),
  mutation: new GraphQLObjectType({
    name: 'BlogMutation',
    description: 'Blog mutation works',
    fields: {
      hello_blog: {
        type: GraphQLString,
        resolve: () => {
          return 'Blog Mutation Works'
        }
      },
      addBlog : addBlog,
      update_blog : update_blog,
      deleteBlog: deleteBlog,
      getBlogByID: getBlogByID
    }
  })
})
