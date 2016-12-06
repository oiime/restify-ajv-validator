# restify-ajv-validator

restify middle ware to validate requests, it uses [ajv](https://github.com/epoberezkin/ajv) as the underlying validator which accepts json schemas. Inspired by [restify-json-schema-validation-middleware]|(https://github.com/CanTireInnovations/restify-json-schema-validation-middleware)

## Usage

### Partial request validation
#### Validates a property within req (eg: query, body, params, headers etc)
```JavaScript
const validator = require('restify-ajv-validator')

const routeSchema = {
  type: 'object',
  properties: {
    foo: {type: 'string'},
    bar: {
      type: 'object',
      properties: {
        k: {items: {type: 'string', enum: ['1', '2']}},
        h: {type: 'string', format: 'hostname'}
      }
    }
  }
}

server.post('/route', validator.body(routeSchema), function (req, res, next) {

})
```

### Full request validation

```JavaScript
const validator = require( 'restify-json-schema-validation-middleware' );

const schema = {
    type: 'object',
    properties: {
      body: {
        foo: {type: 'string'},
        bar: {
          type: 'object',
          properties: {
            k: {items: {type: 'string', enum: ['1', '2']}},
            h: {type: 'string', format: 'hostname'}
          }
        }
      },
      headers: {

      }
    },
    required: [ 'body' ]
};

server.post('/route', validator(routeSchema), function (req, res, next) {

})
```
## Options
### Options can be passed as a plain object after the schema. eg: validator(schema, {coerceTypes: true})

`coerceTypes`: boolean that allows you to modify the data object for more loose matching (eg: force a string into an integer etc). note this would change the original values

`useDefaults`: boolean that allows defaults to be injected into the data object

`errorHandler`: an alternative function to call when validation fails

```JavaScript
const errorHandler = function (req, res, next, errors, errorText) {
  return next(new validator.ValidationError(errorText, errors))
}
server.post('/route', validator(routeSchema, {errorHandler: errorHandler}), function (req, res, next) {
})
```

## Changing defaults
```
const validator = require( 'restify-json-schema-validation-middleware' );
validator.defaults.coerceTypes = true;
```
