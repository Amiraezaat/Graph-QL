// ========= the Requirements ==========
const { GraphQLString, GraphQLList, GraphQLID } = require('graphql')
const { GraphQLValidation } = require('../../../middelwares/validation')
const validators = require('../Blog.validation')
const { authofQL } = require('../../../middelwares/auth')
const { endPoints } = require('../Blog.endPoint')
const blogModel = require('../../../DB/Models/Blog')
const {
  validation_error,
  access_deined
} = require('../../../Utils/User_Errors')
const { Blog_Type } = require('./types')

//=========== Add Blog API ==================
exports.addBlog = {
  type: GraphQLString,
  args: {
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    price: { type: GraphQLString },
    token: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const user = await authofQL(args.token, endPoints.Add_Blog)

    if (!user) {
      access_deined()
    } else {
      const { value, error } = GraphQLValidation(validators.add_blog, args)
      if (error) {
        validation_error(error)
      } else {
        const { title, desc, price } = args
        const newblog = new blogModel({
          title,
          desc,
          price,
          createdBy: user._id
        })
        await newblog.save()

        return 'your Blog is added'
      }
    }
  }
}

//=========== Update Blog API ===============
exports.update_blog = {
  type: GraphQLString,
  args: {
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    price: { type: GraphQLString },
    token: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const user = await authofQL(args.token, endPoints.Update_blog)

    if (!user) {
      access_deined()
    } else {
      const { value, error } = GraphQLValidation(validators.update_blog, args)
      if (error) {
        validation_error(error)
      } else {
        const blogFinder = await blogModel.findOne({ _id: args.id })
        if (blogFinder) {
          if (blogFinder.createdBy.toString() == user._id.toString()) {
            await blogModel.updateOne({ _id: args.id }, { ...args })
            return 'updated done'
          } else {
            return 'Sorry you are not the owner of this blog, So you cannot upadte it'
          }
        } else {
          return 'there is no blog with this id'
        }
      }
    }
  }
}

//=========== Delete Blog API ===============
exports.deleteBlog = {
  type: GraphQLString,
  args: {
    id: { type: GraphQLID },
    token: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const user = await authofQL(args.token, endPoints.delete_Blog)

    if (!user) {
      access_deined()
    } else {
      const { value, error } = GraphQLValidation(validators.delete_blog, args)
      if (error) {
        validation_error(error)
      } else {
        if (user.role == 'Admin') {
          const blogFind = await blogModel.findOneAndDelete({
            _id: args.id
          })
          if (blogFind) {
            return 'blog deleted done by admin'
          } else {
            return 'there is no blog with this id'
          }
        } else if (user.role == 'User') {
          const blogFinder = await blogModel.findOneAndDelete({
            _id: args.id,
            createdBy: user._id
          })
          if (blogFinder) {
            return 'your blog is deleted'
          } else {
            return 'you are not the owner of this blog so You cannot delete it'
          }
        } else {
          return 'Cannot access this api'
        }
      }
    }
  }
}

//=========== get all blogs API =============
exports.getAllBlogs = {
  type: new GraphQLList(Blog_Type),
  resolve: async () => {
    const blogs = await blogModel
      .find({})
      .populate({ path: 'createdBy', select: 'name email' })
    return blogs
  }
}

//=========== get blog by its ID  API =============
exports.getBlogByID = {
  type: Blog_Type,
  args: {
    id: { type: GraphQLID }
  },
  resolve: async (__,args) => {
    const blog = await blogModel
      .findOne({ _id: args.id })
      .populate({ path: 'createdBy', select: 'name email' })
    return blog
  }
}
