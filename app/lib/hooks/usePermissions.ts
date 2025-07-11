import { useSession } from "~/lib/providers/SessionProvider";
import { useMyPermissions } from "./useAuth";
import type { AuthUser } from "~/types/dashboard";

/**
 * Hook for checking user permissions
 * Now fetches permissions from the API endpoint instead of relying on session data
 */
export function usePermissions() {
  const { user } = useSession();
  const { data: permissionsResponse, isLoading, error } = useMyPermissions();

  // Get permissions from API response
  const permissions = permissionsResponse?.data?.permissions || [];

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) {
      return false;
    }

    // Super admin has all permissions
    if (isSuperAdmin()) {
      return true;
    }

    return permissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissionList: string[]): boolean => {
    if (!user) {
      return false;
    }

    // Super admin has all permissions
    if (isSuperAdmin()) {
      return true;
    }

    return permissionList.some((permission) =>
      permissions.includes(permission)
    );
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissionList: string[]): boolean => {
    if (!user) {
      return false;
    }

    // Super admin has all permissions
    if (isSuperAdmin()) {
      return true;
    }

    return permissionList.every((permission) =>
      permissions.includes(permission)
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
      const resourcePermissions = permissions.filter((p) =>
        p.startsWith(`${resource}.`)
      );
      return resourcePermissions.length > 0;
    }
  };

  return {
    user,
    permissions,
    isLoading,
    error,
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

  // Product permissions
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_READ: "products.read",
  PRODUCTS_UPDATE: "products.update",
  PRODUCTS_DELETE: "products.delete",
  PRODUCTS_MANAGE: "products.manage",

  // Billing permissions
  BILLING_READ: "billing.read",
  BILLING_MANAGE: "billing.manage",
} as const;

/**
 * Resource constants for easy reference
 */
export const RESOURCES = {
  USERS: "users",
  TENANTS: "tenants",
  ANALYTICS: "analytics",
  ROLES: "roles",
  SYSTEM: "system",
  PRODUCTS: "products",
  BILLING: "billing",
} as const;
