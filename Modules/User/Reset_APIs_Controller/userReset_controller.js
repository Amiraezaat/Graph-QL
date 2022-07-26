const userModel = require('../../../DB/Models/User')
const jwt = require('jsonwebtoken')
const { catchError } = require('../../../Utils/Catch_error')

exports.confirmEmail = async (req, res) => {
  try {
    const decode = jwt.verify(req.params.token, process.env.tokenKey)
    await userModel.findOneAndUpdate(
      { _id: decode._id },
      { confirmed: true },
      { new: true }
    )
    res.json({ message: 'Confirmed done ' })
  } catch (error) {
    catchError(res, error)
  }
}
