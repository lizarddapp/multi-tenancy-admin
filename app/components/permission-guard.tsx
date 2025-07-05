import type { ReactNode } from "react";
import { usePermissions } from "~/lib/hooks/usePermissions";

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  resource?: string;
  action?: string;
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 */
export function PermissionGuard({
  children,
  permission,
  permissions,
  resource,
  action,
  requireAll = false,
  fallback = null,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, canAccess } =
    usePermissions();

  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    // Multiple permissions check
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else if (resource) {
    // Resource-based check
    hasAccess = canAccess(resource, action);
  } else {
    // No permission specified, allow access
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Hook version for conditional rendering in components
 */
export function usePermissionGuard() {
  const permissions = usePermissions();

  const canRender = (
    options: Omit<PermissionGuardProps, "children" | "fallback">
  ) => {
    const {
      permission,
      permissions: perms,
      resource,
      action,
      requireAll = false,
    } = options;

    if (permission) {
      return permissions.hasPermission(permission);
    } else if (perms && perms.length > 0) {
      return requireAll
        ? permissions.hasAllPermissions(perms)
        : permissions.hasAnyPermission(perms);
    } else if (resource) {
      return permissions.canAccess(resource, action);
    }

    return true;
  };

  return { canRender, ...permissions };
}
