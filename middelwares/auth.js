const { UserInputError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const userModel = require('../DB/Models/User')

exports.Roles = {
  Admin: 'Admin',
  User: 'User'
}

// auth for graph ql
exports.authofQL = async (Bearertoken, accessRole) => {
  const token = Bearertoken.split('Bearer ')[1]
  if (!token || token == undefined || token == null) {
    throw new UserInputError('token in-valide')
  } else {
    const decode = jwt.verify(token, process.env.tokenKey)
    const user = await userModel
      .findOne({ _id: decode._id })
      .select('name email role')
    if (!user) {
      throw new UserInputError('un authenticated user')
    } else {
      if (!accessRole.includes(user.role)) {
        throw new UserInputError('un authorized user')
      } else {
        return user
      }
    }
  }
}

// auth for rest APIs
exports.authforRest = accessRoles => {
  return async (req, res, next) => {
    try {
      const headerToken = req.headers['authorization']

      if (
        !headerToken ||
        headerToken == null ||
        headerToken == undefined ||
        !headerToken.startsWith(`${process.env.Bearerkey}`)
      ) {
        res.json({ message: 'header token error' })
      } else {
        const token = headerToken.split(' ')[1]

        if (!token || token == null || token == undefined || token.length < 1) {
          res.json({ message: 'in-valid token ' })
        } else {
          const decoded = jwt.verify(token, process.env.tokenKey)

          const findUser = await userModel
            .findById(decoded._id)
            .select('name email role')
          if (!findUser) {
            res.json({ message: 'in-valid loggin user ' })
          } else {
            if (accessRoles.includes(findUser.role)) {
              req.user = findUser
              next()
            } else {
              res.status(401).json({ message: 'not auth user' })
            }
          }
        }
      }
    } catch (error) {
      res.json({ message: 'token catch error', error })
    }
  }
}
