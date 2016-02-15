'use strict';

/**
 * Serverless Module: Lambda Handler
 * - Your lambda functions should be a thin wrapper around your own separate
 * modules, to keep your code testable, reusable and AWS independent
 * - 'serverless-helpers-js' module is required for Serverless ENV var support.  Hopefully, AWS will add ENV support to Lambda soon :)
 */

// Require Serverless ENV vars
var ServerlessHelpers = require('serverless-helpers-js').loadEnv();

// Require Logic
var Users = require('../lib/users.vogels.js')
var Promise = require('bluebird')
Promise.promisifyAll(require('vogels/lib/scan').prototype)

// Lambda Handler
module.exports.handler = function(event, context) {
  switch(event.method) {
    case 'GET':
      if (event.params.id)
        return Users.getAsync({id: event.params.id}).then(function (result) {
          // result.attrs.permissions = result.getPermissions()
          return context.succeed({ "user": result })
        }).catch(context.fail)
        // get one item
      else
        return Users.scan().execAsync().then(function (result) { 
          result.Items.map(function (item) {
            // item.attrs.permissions = item.getPermissions()
          })
          return context.succeed({ "users": result.Items })
        }).catch(context.fail)
        // get all of them
      break
    case 'POST':
      return Users.createAsync(event.body).then(function (result) {
        return context.succeed({ "user": result })
      }).catch(context.fail)
      break
    case 'PUT':
      event.body.id = event.params.id
      return Users.createAsync(event.body).then(function (result) {
        return context.succeed({ "user": result })
      }).catch(context.fail)
      break
    case 'DELETE':
      return Users.destroyAsync({id: event.params.id}).then(function (result) {
        return context.succeed({ "user": result })
      }).catch(context.fail)
      break
    default:
      break
  }
};