'use strict'
/*eslint no-undef:0 */
process.env.SERVERLESS_STAGE='dev'


var assert = require('assert')
var rolesDefinitions = require('./roles.js')

describe('users.vogels', function () {

  describe('#can(action)', function () {
    it('it correctly determine permissions from roles', function (done) {
      var currentRoles = rolesDefinitions.roles
      rolesDefinitions.roles = {}
      rolesDefinitions.roles.BillingAdmin=['CreateBills','ReportBills']
      rolesDefinitions.roles.User=['GetUser','GetUsers']
      rolesDefinitions.roles.Admin=['User', 'CreateUser', 'DeleteUser', 'UpdateUser']

      var roles = ['BillingAdmin','Admin']
      var permissions = rolesDefinitions.getPermissions(roles)

      assert.ok(permissions.CreateBills, 'CreateBills')
      assert.ok(permissions.ReportBills, 'ReportBills')
      assert.ok(permissions.GetUser, 'GetUser')
      assert.ok(permissions.GetUsers, 'GetUsers')
      assert.ok(permissions.CreateUser, 'CreateUser')
      assert.ok(permissions.DeleteUser, 'DeleteUser')
      assert.ok(permissions.UpdateUser, 'UpdateUser')
      // put the roles back
      rolesDefinitions.roles = currentRoles

      done()
    })
  })
})


// module.exports.roles = {
//   'Admin': ['User', 'DeleteUser', 'CreateUser', 'PostUser'],
//   'User' : ['GetUser', 'GetUsers']
// }

// module.exports.getPermissions = function (roles) {

//   var permissions = {}
//   roles.forEach(function (role) {
//     module.exports.getPermRecursive(permissions, role)
//   })
//   return permissions
// }

// module.exports.getPermRecursive = function(permissions, role) {
//   if (module.exports.roles[role])
//     module.exports.roles[role].forEach(function (item) {
//       module.exports.getPermRecursive(permissions, item)
//     })
//   else // it isn't a role so it is a permission
//     permissions[role] = true
//     return permissions
// }