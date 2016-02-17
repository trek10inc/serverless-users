
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

// this should be function(action, [org | object])
// if just action is present just see if the user can do that action for any org.
// if action, org see if the user can do the action for a specific object
// if action, object
//    if object has .may function return the result of object.may(this.attrs, action)
//    else if object has .orgId return this.getPermissions(object.orgId)[action] || false
//    else return true

module.exports.prototype.can = function(action, org, object) {
  var can = this.getPermissions(org)[action]
  if (can) {
    if (typeof object === 'object') {
      if (typeof object.may === 'function')
        return object.may(this, action)
      else {
        return (!object.orgId || this.attrs.orgs && this.attrs.orgs.some(function (org) { return org.id === object.orgId}))
      } 
    }
    else
      return true
  }
  else
    return false
}

module.exports.prototype.is = module.exports.prototype.can

module.exports.prototype.getPermissions = function (org) {
  var userOrgRoles = this.attrs.orgs.filter(function(o) { return o.id == org })[0].roles
  return roles.getPermissions(userOrgRoles)
}

module.exports.prototype.setPermissionAttributes = function() {
  if (this.attrs.orgs) {
    this.attrs.orgs.forEach(function (org) {
      org.permissions = roles.getPermissions(org.roles)
    })
  }
}

module.exports.removePermissionsFromOrgs = function(object) {
  if (object.orgs)
    object.orgs.forEach(function (org) {
      delete org.permissions
    })
}

// if object has function may(user, action) and object.function(user, action) || 
module.exports.prototype.may(action, org, object)

// Maybe User.may(action, org, object) where the object has a function object.may(action, org, user)

// Jared Short [3:56 PM] 
// Yeah

// [3:56] 
// hmm.

// Joel Haubold [3:56 PM] 
// Would just be shortcut for User.can(action, org) && object.may(action, org, user)

// Jared Short [3:56 PM] 
// Just needs some basic “defaults” and then anything advanced people just gotta overide

// [3:56] 
// Yeah

// Joel Haubold [3:57 PM] 
// I guess we could just look for a "owner" or "userID" attribute in the object.

// Jared Short [3:57 PM] 
// arguably “org” should just be assumed to be current org of user or something

// [3:57] 
// User.id is set for vogels isn’t it?

// Joel Haubold [3:57 PM] 
// yes

// Jared Short [3:57 PM] 
// There you go

// Joel Haubold [3:57 PM] 
// so we look for a match between object.userId and user.id

// Jared Short [3:57 PM] 
// Yep

// Joel Haubold [3:58 PM] 
// That is basically what admittance does.

// Jared Short [3:58 PM] 
// That’s all we gotta do

// [3:58] 
// Just keep it super simple

// [3:58] 
// We can implement some nice stuff for harbor that maybe verifies for an Org as well somehow

// [3:58] 
// something liek that

// Joel Haubold [3:58 PM] 
// We should probably check for orgID not userID

// Jared Short [3:59 PM] 
// Yeah

// [3:59] 
// Perfect

// Joel Haubold [3:59 PM] 
// Customizable for whatever the Business Logic requires.

// Jared Short [4:00 PM] 
// Yep

