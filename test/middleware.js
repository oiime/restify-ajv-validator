'use strict'
var sinon = require('sinon');
var restify = require('restify');
var assert = require('chai').assert;

var validator = require( '..' );

function matchError( message ) {
  return sinon.match( function( err ) {
    assert.instanceOf( err, validator.ValidationError );
    assert.equal( err.body.code, 'ValidationError');
    return true;
  });
}

describe('testMiddlewares', function () {
  describe('test01', function () {
    var schema = {
        type: 'object',
        properties: {
          foo: {type: 'string'},
          fooObject: {
            type: 'object',
            properties: {
              p1: {type: 'string'},
              p2: {items: {type: 'integer'}}
            }
          }
        },
        additionalProperties: false,
        required: [ 'foo', 'fooObject' ]
    };
    var validate = validator.body(schema, {coerceTypes: true});
    describe('valid', function() {
      it('passes', function() {
        var req = {
          body: {
            foo: 'bar',
            fooObject: {
              p1: 1,
              p2: [1, 2, 3]
            }
          }
        }
        var next = sinon.spy()
        validate(req, null, next)
        sinon.assert.calledOnce(next)
        sinon.assert.calledWith(next)
        assert.isString( req.body.fooObject.p1 );
      })
    })
    describe('invalid', function() {
      it('doesnt pass', function() {
        var req = {
          body: {
            fooObject: {
              p1: 'foo',
              p2: [1, 2, 3]
            }
          }
        }
        var next = sinon.spy()
        validate(req, null, next)
        sinon.assert.calledOnce(next)
        sinon.assert.calledWithExactly( next, matchError( 'request.body: invalid type (expected string, got object)' ) );
      })
    })
  })
  describe('test02', function () {
    var schema = {
        type: 'object',
        properties: {
          params: {
            type: 'object',
            properties: {
              foo: {type: 'string'},
              fooObject: {
                type: 'object',
                properties: {
                  p1: {type: 'string'},
                  p2: {items: {type: 'integer'}}
                }
              }
            }
          }
        },
        additionalProperties: false,
        required: [ 'params' ]
    };
    var validate = validator(schema, {coerceTypes: true});
    describe('valid', function() {
      it('passes', function() {
        var req = {
          params: {
            foo: 'bar',
            fooObject: {
              p1: 1,
              p2: [1, 2, 3]
            }
          }
        }
        var next = sinon.spy()
        validate(req, null, next)
        sinon.assert.calledOnce(next)
        sinon.assert.calledWith(next)
        assert.isString( req.params.fooObject.p1 );
      })
    })
    describe('invalid', function() {
      it('doesnt pass', function() {
        var req = {
          params: {
            fooObject: {
              p1: 'foo',
              p2: [1, 2, 3]
            }
          }
        }
        var next = sinon.spy()
        validate(req, null, next)
        sinon.assert.calledOnce(next)
        sinon.assert.calledWithExactly( next, matchError( 'request.body: invalid type (expected string, got object)' ) );
      })
    })
  })
})
