
//==================the requierments ==============
const { GraphQLString, GraphQLNonNull, GraphQLList } = require('graphql')
const userModel = require('../../../DB/Models/User')
const { send_Email } = require('../../../Utils/send_Email')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { userType, loginResType } = require('./types')
const { GraphQLValidation } = require('../../../middelwares/validation')
const validators = require('../User.validation')
const { UserInputError } = require('apollo-server-express')
const { authofQL } = require('../../../middelwares/auth')
const { endPoints } = require('../User.endPoint')
const { nanoid } = require('nanoid')


// =================  Sign Up API =======================
exports.adduser = {
  type: GraphQLString,
  args: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    cPassword: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const { value, error } = GraphQLValidation(validators.adduser, args)
    if (error) {
      throw new UserInputError('validation Error', { error })
    } else {
      const { email } = args
      const emailcheck = await userModel.findOne({ email }).select('email')
      if (emailcheck) {
        return 'email already exist'
      } else {
        const newuser = new userModel(args)
        const saved = await newuser.save()
        const token = jwt.sign(
          { _id: saved._id, email: saved.email, role: saved.role },
          process.env.tokenKey
        )
        console.log(process.env.tokenKey);       
        const message = `<a href= "http://localhost:3000/confirm/${token}">click here to confirm your email</a>`
        send_Email(email, message, 'check please for test')
        return 'Done'
      }
    }
  }
}

// =================  Sign In API =======================
exports.signIn = {
  type: loginResType,
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const { value, error } = GraphQLValidation(validators.sigIn, args)
    if (error) {
      throw new UserInputError('Validation Error', { error })
    } else {
      const { email, password } = args
      const user = await userModel.findOne({ email })
      if (!user) {
        return 'email not exist'
      } else {
        const match = await bcrypt.compare(password, user.password)
        if (!match) {
          return { message: 'password in-valid' }
        } else {
          const token = jwt.sign(
            { _id: user._id, email: user.email, role: user.role },
            process.env.tokenKey
          )
          return { message: ' login success', token: token }
        }
      }
    }
  }
}

// ================== Get All Users API =================
exports.getAllUsers = {
  type: new GraphQLList(userType),
  resolve: async () => {
    const user = await userModel.find({ confirmed: true })
    return user
  }
}

// ================= Update User Profile API =============
exports.update_user = {
  type: GraphQLString,
  args: {
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    token: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const user = await authofQL(args.token, endPoints.Update_profile)
    if (!user) {
      throw new UserInputError('cannot access this api')
    } else {
      const { value, error } = GraphQLValidation(
        validators.updtate_profile,
        args
      )
      if (error) {
        throw new UserInputError('validation Error', { error })
      } else {
        const findUser = await userModel.findById(user._id)
        if (args.email && !args.name) {
          const existance = await userModel.findOne({ email: args.email })
          if (existance) {
            return 'email already exist please choose another one'
          } else {
            const newuser = await userModel.findOneAndUpdate(
              { _id: findUser._id },
              { email: args.email, confirmed: false },
              { new: true }
            )
            const token = jwt.sign(
              { _id: newuser._id, email: newuser.email, role: newuser.role },
              process.env.tokenKey
            )
          
            const message = `<a href="https://graphqlapp1.herokuapp.com/confirm/${token}">click here to confirm your email</a>`
            send_Email(args.email, message, 'check please for test')
            return 'please checkk your email to confirm it '
          }
        }
        if (args.name && !args.email) {
          await userModel.findOneAndUpdate(
            { _id: findUser._id },
            { name: args.name },
            { new: true }
          )
          return 'update done'
        }
        if (args.email && args.name) {
          const existance = await userModel.findOne({ email: args.email })
          if (existance) {
            return 'email already exist please choose another one'
          } else {
            const newuser = await userModel.findOneAndUpdate(
              { _id: findUser._id },
              { email: args.email, confirmed: false, name: args.name },
              { new: true }
            )
            
            const token = jwt.sign(
              { _id: newuser._id, email: newuser.email, role: newuser.role },
              process.env.tokenKey
            )
           
            const message = `<a href = "http://localhost:3000/confirm/${token}" >click here to confirm your email</a>`
            send_Email(newuser.email, message, 'check please for test')
            return 'please checkk your email to confirm it'
          }
        }
      }
    }
  }
}

// ================= Delete User API =====================
exports.deleteUser = {
  type: GraphQLString,
  args: {
    email: { type: GraphQLString },
    token: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const user = await authofQL(args.token, endPoints.delete_User)
    
    if (!user) {
      throw new UserInputError('cannot access this api')
    } else {
      const { value, error } = GraphQLValidation(validators.delete_user, args)
      if (error) {
        throw new UserInputError('validation Error', { error })
      } else {
        if (user.role == 'Admin') {
          if (args.email) {
            const userFind = await userModel.findOneAndDelete({
              email: args.email,
              role: 'User'
            })
            if (userFind) {
              return 'user deleted done by admin'
            } else {
              return 'there is no user with this email'
            }
          } else {
            await userModel.findOneAndDelete({
              email: user.email
            })
            return 'your account is deleted'
          }
        }
      }
    }
  }
}

// ================= Fogert password  APIs ===============

/* First send code API */
exports.send_code = {
  type: GraphQLString,
  args: {
    email: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const { value, error } = GraphQLValidation(validators.send_code, args)
    if (error) {
      throw new UserInputError('Validation Error', { error })
    } else {
      const { email } = args
      const email_check = await userModel.findOne({ email })
      if (email_check) {
        const code = nanoid()
        await userModel.updateOne({ email }, { code })
        const message = `please take this code and enter it for rest password : ${code}`
        send_Email(email, message, 'verification code')
        return 'please check your email to get the verfication Code '
      } else {
        return 'in-valid email'
      }
    }
  }
}
/* second reset password API */
exports.Reset_password = {
  type: GraphQLString,
  args: {
    email: { type: GraphQLString },
    code: { type: GraphQLString },
    newPassword: { type: GraphQLString },
    cPassword: { type: GraphQLString }
  },
  resolve: async (__, args) => {
    const { value, error } = GraphQLValidation(validators.reset_pass, args)
    if (error) {
      throw new UserInputError('Validation Error', { error })
    } else {
      const email_check = await userModel.findOne({
        email: args.email,
        code: args.code
      })
      if (email_check) {
        const hashedpass = await bcrypt.hash(args.newPassword, 8)
        await userModel.updateOne(
          { email: args.email },
          { password: hashedpass }
        )
        return ' your password is changed successfully'
      } else {
        return 'email or code is invalid'
      }
    }
  }
}
