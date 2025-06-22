import { Link, type LinkProps } from "react-router";
import { forwardRef } from "react";
import {
  useTenantNavigation,
  buildTenantPath,
} from "~/lib/hooks/useNavigation";

export interface TenantLinkProps extends Omit<LinkProps, "to"> {
  /**
   * The path to navigate to (without tenant prefix)
   * Will be automatically prefixed with current tenant
   */
  to: string;

  /**
   * Whether this is a global link (bypasses tenant prefixing)
   * Use for links like login, logout, or tenant switching
   */
  global?: boolean;

  /**
   * Override the tenant slug (useful for tenant switching)
   */
  tenant?: string;
}

/**
 * Tenant-aware Link component that automatically prefixes routes with tenant context
 *
 * Usage:
 * - <TenantLink to="/dashboard">Dashboard</TenantLink> → /{tenant}/dashboard
 * - <TenantLink to="/users">Users</TenantLink> → /{tenant}/users
 * - <TenantLink to="/login" global>Login</TenantLink> → /login
 * - <TenantLink to="/dashboard" tenant="other-tenant">Switch</TenantLink> → /other-tenant/dashboard
 */
export const TenantLink = forwardRef<HTMLAnchorElement, TenantLinkProps>(
  ({ to, global = false, tenant: overrideTenant, children, ...props }, ref) => {
    const { currentTenant } = useTenantNavigation();

    // Determine the final path
    const getFinalPath = (): string => {
      // If global link, use path as-is
      if (global) {
        return to;
      }

      // Use override tenant if provided, otherwise current tenant
      const tenantSlug = overrideTenant || currentTenant;

      if (!tenantSlug) {
        console.warn("TenantLink: No tenant context found, using path as-is");
        return to;
      }

      return buildTenantPath(tenantSlug, to);
    };

    const finalPath = getFinalPath();

    return (
      <Link ref={ref} to={finalPath} {...props}>
        {children}
      </Link>
    );
  }
);

TenantLink.displayName = "TenantLink";

/**
 * Utility component for navigation items with active state
 */
export interface TenantNavLinkProps extends TenantLinkProps {
  /**
   * Additional className to apply when link is active
   */
  activeClassName?: string;

  /**
   * Function to determine if link should be considered active
   * Receives the current path (without tenant prefix) and target path
   */
  isActive?: (currentPath: string, targetPath: string) => boolean;
}

/**
 * Navigation link with active state support
 */
export const TenantNavLink = forwardRef<HTMLAnchorElement, TenantNavLinkProps>(
  (
    {
      to,
      global = false,
      tenant: overrideTenant,
      activeClassName = "",
      isActive,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const { getCurrentPath } = useTenantNavigation();

    // Determine if this link is active
    const checkIsActive = (): boolean => {
      if (global) {
        // For global links, compare with full pathname
        return window.location.pathname === to;
      }

      const currentPath = getCurrentPath();

      if (isActive) {
        return isActive(currentPath, to);
      }

      // Default active logic
      if (to === "/" || to === "") {
        return currentPath === "/" || currentPath === "";
      }

      return currentPath === to || currentPath.startsWith(to + "/");
    };

    const active = checkIsActive();
    const finalClassName = active
      ? `${className} ${activeClassName}`.trim()
      : className;

    return (
      <TenantLink
        ref={ref}
        to={to}
        global={global}
        tenant={overrideTenant}
        className={finalClassName}
        {...props}
      >
        {children}
      </TenantLink>
    );
  }
);

TenantNavLink.displayName = "TenantNavLink";

/**
 * Breadcrumb component that handles tenant context
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  global?: boolean;
}

export interface TenantBreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

export const TenantBreadcrumb: React.FC<TenantBreadcrumbProps> = ({
  items,
  separator = "/",
  className = "",
}) => {
  const { currentTenant } = useTenantNavigation();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {/* Tenant context indicator */}
      {currentTenant && (
        <>
          <span className="text-muted-foreground font-medium">
            {currentTenant}
          </span>
          {items.length > 0 && (
            <span className="text-muted-foreground">{separator}</span>
          )}
        </>
      )}

      {/* Breadcrumb items */}
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          {item.path ? (
            <TenantLink
              to={item.path}
              global={item.global}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              {item.label}
            </TenantLink>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}

          {index < items.length - 1 && (
            <span className="text-muted-foreground">{separator}</span>
          )}
        </div>
      ))}
    </nav>
  );
};
