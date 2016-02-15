var vogels = require('vogels')
vogels.AWS.config.update({region: 'us-east-1'})
var Joi    = require('joi')

module.exports = vogels.define('users', {
  hashKey: 'id',

  timestamps: false,
  tableName: function() { return 'serverless-users-' + process.env.SERVERLESS_STAGE },
  schema: {
    id: Joi.string(),
    roles: vogels.types.stringSet(),
    orgIds: vogels.types.stringSet(),
    userMeta: Joi.object()
  },
})