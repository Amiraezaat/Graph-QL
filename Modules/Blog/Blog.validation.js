const joi = require('joi')

exports.add_blog = joi.object({
  title: joi.string().required(),
  desc: joi.string().required(),
  price: joi.number().required(),
  token: joi.string().required()
})
exports.update_blog = joi.object({
  title: joi.string().optional(),
  desc: joi.string().optional(),
  price: joi.number().optional(),
  token: joi.string().required(),
  id: joi
    .string()
    .max(24)
    .min(24)
    .required()
})

exports.delete_blog = joi.object({
    token: joi.string().required(),
    id: joi
      .string()
      .max(24)
      .min(24)
      .required()
  })