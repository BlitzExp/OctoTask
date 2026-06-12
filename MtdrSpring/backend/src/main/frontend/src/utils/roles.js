export function isPrivileged(user) {
  return user?.role === 'admin' || user?.role === 'manager';
}

export function formatRole(role) {
  if (!role) return 'Member';
  if (role === 'admin' || role === 'manager') return 'Manager';
  if (role === 'user') return 'Developer';
  return role.charAt(0).toUpperCase() + role.slice(1);
}
