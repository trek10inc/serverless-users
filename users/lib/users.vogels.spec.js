'use strict'
/*eslint no-undef:0 */
process.env.SERVERLESS_STAGE='dev'


var assert = require('assert')
var Users = require('./users.vogels.js')

describe('users.vogels', function () {

  describe('#can(action)', function () {
    it('it should not allow when user\'s orgs is missing', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      delete user.attrs.orgs
      assert.ok(!user.can('GetUser'))
      done()
    })
    it('it should allow action when any orgs has permission', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['User'] }, { id: 'org2', roles: ['Billing'] }]

      assert.ok(user.can('GetUser'))
      done()
    })
    it('it should not allow action when no orgs have permission', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['User'] }, { id: 'org2', roles: ['Billing'] }]

      assert.equal(user.can('DeleteUser'), false)
      done()
    })
    it('it should allow action when org is specified and user has permission for that org', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['Admin'] }, { id: 'org2', roles: ['Billing'] }]

      assert.equal(user.can('DeleteUser', 'org1'), true)
      done()
    })
    it('it should allow not action when org is specified and user does not have permission for that org', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['User'] }, { id: 'org2', roles: ['Billing'] }]

      assert.equal(user.can('DeleteUser', 'org1'), false)
      done()
    })
    it('it should return result of customobject.may(user.attr, action) when custom object', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['Admin'] }, { id: 'org2', roles: ['Billing'] }]
      var customObject = {
        may: function () { return true }
      }
      assert.equal(user.can('DeleteUser', customObject), customObject.may())
      done()
    })
    it('it should allow action when customObject.orgId is specified and user has permission for that org', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['User'] }, { id: 'org2', roles: ['Billing'] }]
      var customObject = {
        orgId: 'org1'
      }
      assert.equal(user.can('GetUser', customObject), true)
      done()
    })
    it('it should not allow action when customObject.orgId is specified and user does not have permission for that org', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['User'] }, { id: 'org2', roles: ['Billing'] }]
      var customObject = {
        orgId: 'org1'
      }
      assert.equal(user.can('DeleteUser', customObject), false)
      done()
    })
    it('it should allow action when customObject.orgId is not specified and user has permission for any org', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['User'] }, { id: 'org2', roles: ['Billing'] }]
      var customObject = {}
      assert.equal(user.can('GetUser', customObject), true)
      done()
    })
    it('it should not allow action when customObject.orgId is not specified and user does not have permission for any org', function (done) {
      var user = new Users()
      user.attrs.id = 'me'
      user.attrs.orgs = [{ id: 'org1', roles: ['User'] }, { id: 'org2', roles: ['Billing'] }]
      var customObject = {}
      assert.equal(user.can('DeleteUser', customObject), false)
      done()
    })
  })
})
