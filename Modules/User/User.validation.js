const joi = require('joi')

// validation for GraphQL APIs
exports.adduser = joi.object({
  name: joi.string().required(),
  email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().valid(joi.ref('password')).required()
})
exports.sigIn = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .required(),
  password: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required()
})

exports.delete_user = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .optional(),
  token: joi.string().required()
})
exports.updtate_profile = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .optional(),
  name: joi.string().optional(),
  token: joi.string().required()
})

exports.send_code = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .required()
})

exports.reset_pass = joi.object({
  email: joi
    .string()
    .email({ tlds: { allow: ['com', 'net'] } })
    .required(),
  newPassword: joi
    .string()
    .pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/))
    .required(),
  cPassword: joi.string().valid(joi.ref('newPassword')).required(),
  code: joi.string().required()
})
