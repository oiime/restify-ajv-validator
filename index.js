const Ajv = require('ajv')
const restify = require('restify')
const util = require('util')

var __REQUEST_KEYS = ['params', 'body', 'headers', 'files', 'request']

function ValidationError (message, errors) {
  restify.RestError.call(this, {
    restCode: 'ValidationError',
    statusCode: 400,
    message: message,
    constructorOpt: ValidationError
  })
  this.name = 'ValidationError'
  this.body = Object.assign({}, this.body, { errors: errors || {} })
}

util.inherits(ValidationError, restify.RestError)

function __validate (schema, opt, target) {
  var opt = Object.assign({ v5: true, useDefaults: true }, opt)
  var ajv = new Ajv(opt)
  var validator = ajv.compile(schema)

  return function (req, res, next) {
    var data = {}
    if (target instanceof Array) {
      target.forEach((k) => {
        if (req.k) {
          data[k] = req.k
        }
      })
    } else {
      data = req[target]
    }
    var isValid = validator(data)
    if (!isValid) {
      if (opt.hasOwnProperty('errorHandler')) {
        return errorHandler(req, res, next, validator.errors, ajv.errorsText(validator.errors))
      } else {
        return next(new ValidationError(ajv.errorsText(validator.errors), validator.errors))
      }
    }
    next()
  }
}

function __validator (schema, opt) {
  return __validate(schema, opt, __REQUEST_KEYS)
}

__REQUEST_KEYS.forEach((k) => {
  Object.defineProperty(__validator, k, {value: function (schema, opt) {
    return __validate(schema, opt, k)
  }})
})
__validator.ValidationError = ValidationError

module.exports = __validator
