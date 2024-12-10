import { useAuthStore } from '../store/useAuthStore';
import { Permission } from '../types/auth';

export function usePermissions() {
  const { user, checkPermission } = useAuthStore();

  const hasPermission = (permission: Permission) => {
    return checkPermission(permission);
  };

  const hasAnyPermission = (permissions: Permission[]) => {
    return permissions.some(hasPermission);
  };

  const hasAllPermissions = (permissions: Permission[]) => {
    return permissions.every(hasPermission);
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    userRole: user?.role,
  };
}