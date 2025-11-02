// Permission Utility Functions

/**
 * Check if user has a specific permission
 */
export function hasPermission(
  userPermissions: Set<string> | string[],
  permission: string
): boolean {
  const permSet = userPermissions instanceof Set ? userPermissions : new Set(userPermissions)
  return permSet.has(permission) || permSet.has('*')
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  userPermissions: Set<string> | string[],
  permissions: string[]
): boolean {
  if (permissions.length === 0) return true
  const permSet = userPermissions instanceof Set ? userPermissions : new Set(userPermissions)

  // Super admin check
  if (permSet.has('*')) return true

  return permissions.some((permission) => permSet.has(permission))
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  userPermissions: Set<string> | string[],
  permissions: string[]
): boolean {
  if (permissions.length === 0) return true
  const permSet = userPermissions instanceof Set ? userPermissions : new Set(userPermissions)

  // Super admin check
  if (permSet.has('*')) return true

  return permissions.every((permission) => permSet.has(permission))
}

/**
 * Check if user has a specific role
 */
export function hasRole(userRoles: string[], role: string): boolean {
  return userRoles.includes(role) || userRoles.includes('super_admin')
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(userRoles: string[], roles: string[]): boolean {
  if (roles.length === 0) return true
  if (userRoles.includes('super_admin')) return true
  return roles.some((role) => userRoles.includes(role))
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(userRoles: string[], roles: string[]): boolean {
  if (roles.length === 0) return true
  if (userRoles.includes('super_admin')) return true
  return roles.every((role) => userRoles.includes(role))
}
