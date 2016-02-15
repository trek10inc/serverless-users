
var Promise = require('bluebird')
var vogels  = require('vogels')
var roles   = require('./roles')
var Joi     = require('joi')

vogels.AWS.config.update({region: 'us-east-1'})

module.exports = Promise.promisifyAll(vogels.define('users', {
  hashKey: 'id',

  timestamps: false,
  tableName: function() { return 'serverless-users-' + process.env.SERVERLESS_STAGE },
  schema: {
    id: Joi.string(),
    orgs: Joi.array().items(Joi.object().keys({
      id: Joi.string(),
      roles: vogels.types.stringSet()
    })),
    userMeta: Joi.object()
  },
}))

module.exports.prototype.can = function(org, action) {
  var userOrgRoles = this.attrs.orgs.filter(function(o) { return o.id == org })[0].roles

  var permissions = roles.getPermissions(userOrgRoles)

  return permissions[action] || false
}

module.exports.prototype.is = module.exports.prototype.can