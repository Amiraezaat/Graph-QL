// GraphQL validation
exports.GraphQLValidation = (schema, args) => {
  const { value, error } = schema.validate(args, { abortEarly: false })
  return { value, error }
}

// Validation for REST API
const dataMethod = ['body', 'params', 'query']

exports.RestAPIvalidation = schema => {
  return (req, res, next) => {
    const validationErrArr = []
    dataMethod.forEach(key => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false
        })
        if (validationResult.error) {
          validationErrArr.push(validationResult.error.details)
        }
      }
    })
    if (validationErrArr.length) {
      res.json({ message: 'validation error', err: validationErrArr })
    } else {
      next()
    }
  }
}
