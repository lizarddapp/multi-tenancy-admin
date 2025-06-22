import { useSession } from "~/lib/providers/SessionProvider";
import type { AuthUser } from "~/types/dashboard";

/**
 * Hook for checking user permissions
 */
export function usePermissions() {
  const { user } = useSession();

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    // Super admin has all permissions
    if (isSuperAdmin()) {
      return true;
    }

    return user.permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    // Super admin has all permissions
    if (isSuperAdmin()) {
      return true;
    }

    return permissions.some((permission) =>
      user.permissions!.includes(permission)
    );
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) {
      return false;
    }

    // Super admin has all permissions
    if (isSuperAdmin()) {
      return true;
    }

    return permissions.every((permission) =>
      user.permissions!.includes(permission)
    );
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (roleName: string): boolean => {
    if (!user || !user.roles) {
      return false;
    }

    return user.roles.some((role) => role.name === roleName);
  };

  /**
   * Check if user is super admin
   */
  const isSuperAdmin = (): boolean => {
    return hasRole("super_admin");
  };

  /**
   * Check if user can access a resource based on permissions
   */
  const canAccess = (resource: string, action?: string): boolean => {
    if (!user) {
      return false;
    }

    // Super admin can access everything
    if (isSuperAdmin()) {
      return true;
    }

    if (action) {
      // Check specific permission like 'tenants.read'
      return hasPermission(`${resource}.${action}`);
    } else {
      // Check if user has any permission for the resource
      const resourcePermissions =
        user.permissions?.filter((p) => p.startsWith(`${resource}.`)) || [];
      return resourcePermissions.length > 0;
    }
  };

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isSuperAdmin,
    canAccess,
  };
}

/**
 * Permission constants for easy reference
 */
export const PERMISSIONS = {
  // User permissions
  USERS_CREATE: "users.create",
  USERS_READ: "users.read",
  USERS_UPDATE: "users.update",
  USERS_DELETE: "users.delete",
  USERS_MANAGE: "users.manage",

  // Tenant permissions
  TENANTS_CREATE: "tenants.create",
  TENANTS_READ: "tenants.read",
  TENANTS_UPDATE: "tenants.update",
  TENANTS_DELETE: "tenants.delete",
  TENANTS_MANAGE: "tenants.manage",

  // Analytics permissions
  ANALYTICS_READ: "analytics.read",
  ANALYTICS_MANAGE: "analytics.manage",

  // Role permissions
  ROLES_CREATE: "roles.create",
  ROLES_READ: "roles.read",
  ROLES_UPDATE: "roles.update",
  ROLES_DELETE: "roles.delete",
  ROLES_MANAGE: "roles.manage",

  // System permissions
  SYSTEM_MANAGE: "system.manage",
} as const;

/**
 * Resource constants
 */
export const RESOURCES = {
  USERS: "users",
  TENANTS: "tenants",
  ANALYTICS: "analytics",
  ROLES: "roles",
  SYSTEM: "system",
  BILLING: "billing",
  PRODUCTS: "products",
} as const;
