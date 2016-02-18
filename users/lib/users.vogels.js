
var Promise = require('bluebird')
var vogels  = require('vogels')
var roles   = require('./roles')
var Joi     = require('joi')

vogels.AWS.config.update({region: 'us-east-1'})

module.exports = Promise.promisifyAll(vogels.define('users', {
  hashKey: 'id',

  timestamps: false,
  tableName: function () { return 'serverless-users-' + process.env.SERVERLESS_STAGE },
  schema: {
    id: Joi.string(),
    orgs: Joi.array().items(Joi.object().keys({
      id: Joi.string(),
      roles: vogels.types.stringSet()
    })),
    userMeta: Joi.object()
  },
}))

// this should be function(action, [org | object])
// if just action is present just see if the user can do that action for any org.
// if action, org see if the user can do the action for a specific object
// if action, object
//    if object has .may function return the result of object.may(this.attrs, action)
//    else if object has .orgId return this.getPermissions(object.orgId)[action] || false
//    else return true

module.exports.prototype.can = function (action, orgOrObject) {
  if (!this.attrs.orgs)
    return false
  if (typeof orgOrObject === 'undefined')
    return this.attrs.orgs.some(function (o) { return roles.getPermissions(o.roles)[action] })
  if (typeof orgOrObject === 'string')
    return this.getPermissions(orgOrObject)[action] || false
  if (typeof orgOrObject === 'object') {
    if (orgOrObject.may && typeof orgOrObject.may === 'function')
      return orgOrObject.may(this.attrs, action)
    else if (orgOrObject.orgId)
      return this.getPermissions(orgOrObject.orgId)[action] || false
    else
      return this.can(action)
  }
}

module.exports.prototype.is = module.exports.prototype.can

module.exports.prototype.getPermissions = function (org) {
  var userOrgRoles = this.attrs.orgs.filter(function (o) { return o.id === org })[0].roles
  return roles.getPermissions(userOrgRoles)
}

module.exports.prototype.setPermissionAttributes = function () {
  if (this.attrs.orgs) {
    this.attrs.orgs.forEach(function (org) {
      org.permissions = roles.getPermissions(org.roles)
    })
  }
}

module.exports.removePermissionsFromOrgs = function (object) {
  if (object.orgs) {
    object.orgs.forEach(function (org) {
      delete org.permissions
    })
  }
}