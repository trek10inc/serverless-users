module.exports.roles = {
  'Admin': ['User', 'DeleteUser', 'CreateUser', 'PostUser'],
  'User' : ['GetUser', 'GetUsers']
}

module.exports.getPermissions = function (roles) {

  var permissions = {}
  roles.forEach(function (role) {
    module.exports.getPermRecursive(permissions, role)
  })
  return permissions
}

module.exports.getPermRecursive = function(permissions, role) {
  if (module.exports.roles[role])
    module.exports.roles[role].forEach(function (item) {
      module.exports.getPermRecursive(permissions, item)
    })
  else // it isn't a role so it is a permission
    permissions[role] = true
    return permissions
}