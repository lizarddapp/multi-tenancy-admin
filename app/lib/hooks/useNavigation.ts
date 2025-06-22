import { useNavigate, useLocation, useParams } from "react-router";
import { useCallback } from "react";

/**
 * Custom navigation hook that preserves tenant context
 * Automatically prefixes routes with the current tenant slug
 */
export const useTenantNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  // Extract tenant slug from current path or params
  const getCurrentTenant = useCallback((): string | null => {
    // Try to get tenant from params first
    if (params.tenant) {
      return params.tenant;
    }

    // Fallback: extract from pathname
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      // First segment should be the tenant slug
      return pathSegments[0];
    }

    return null;
  }, [params.tenant, location.pathname]);

  /**
   * Navigate to a path while preserving tenant context
   * @param to - The path to navigate to (without tenant prefix)
   * @param options - Navigation options
   */
  const navigateWithTenant = useCallback((
    to: string,
    options?: { replace?: boolean; state?: any }
  ) => {
    const tenant = getCurrentTenant();
    
    if (!tenant) {
      console.warn('No tenant context found, navigating without tenant prefix');
      navigate(to, options);
      return;
    }

    // Remove leading slash if present to avoid double slashes
    const cleanPath = to.startsWith('/') ? to.slice(1) : to;
    const tenantPath = `/${tenant}/${cleanPath}`;
    
    navigate(tenantPath, options);
  }, [navigate, getCurrentTenant]);

  /**
   * Navigate to a path without tenant context (for global routes)
   * @param to - The path to navigate to
   * @param options - Navigation options
   */
  const navigateGlobal = useCallback((
    to: string,
    options?: { replace?: boolean; state?: any }
  ) => {
    navigate(to, options);
  }, [navigate]);

  /**
   * Get the current tenant slug
   */
  const currentTenant = getCurrentTenant();

  /**
   * Check if we're currently in a tenant context
   */
  const isInTenantContext = currentTenant !== null;

  /**
   * Get the current path without tenant prefix
   */
  const getCurrentPath = useCallback((): string => {
    const tenant = getCurrentTenant();
    if (!tenant) return location.pathname;

    const tenantPrefix = `/${tenant}`;
    if (location.pathname.startsWith(tenantPrefix)) {
      return location.pathname.slice(tenantPrefix.length) || '/';
    }

    return location.pathname;
  }, [location.pathname, getCurrentTenant]);

  return {
    // Navigation functions
    navigate: navigateWithTenant,
    navigateGlobal,
    
    // Tenant context
    currentTenant,
    isInTenantContext,
    
    // Path utilities
    getCurrentPath,
    
    // Original navigate for edge cases
    originalNavigate: navigate,
  };
};

/**
 * Utility function to build tenant-aware paths
 * @param tenant - The tenant slug
 * @param path - The path to append
 * @returns The full tenant-aware path
 */
export const buildTenantPath = (tenant: string, path: string): string => {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${tenant}/${cleanPath}`;
};

/**
 * Utility function to extract tenant from a path
 * @param pathname - The pathname to extract tenant from
 * @returns The tenant slug or null
 */
export const extractTenantFromPath = (pathname: string): string | null => {
  const pathSegments = pathname.split('/').filter(Boolean);
  return pathSegments.length > 0 ? pathSegments[0] : null;
};

/**
 * Utility function to remove tenant prefix from a path
 * @param pathname - The pathname to clean
 * @param tenant - The tenant slug to remove
 * @returns The path without tenant prefix
 */
export const removeTenantFromPath = (pathname: string, tenant: string): string => {
  const tenantPrefix = `/${tenant}`;
  if (pathname.startsWith(tenantPrefix)) {
    return pathname.slice(tenantPrefix.length) || '/';
  }
  return pathname;
};

/**
 * Hook to get tenant-aware route matching
 */
export const useTenantRoute = () => {
  const { currentTenant, getCurrentPath } = useTenantNavigation();
  
  /**
   * Check if current route matches a pattern (without tenant prefix)
   * @param pattern - The route pattern to match
   * @returns Whether the current route matches
   */
  const matchesRoute = useCallback((pattern: string): boolean => {
    const currentPath = getCurrentPath();
    
    // Simple pattern matching - can be enhanced with more sophisticated matching
    if (pattern === currentPath) return true;
    
    // Handle wildcard patterns
    if (pattern.endsWith('/*')) {
      const basePattern = pattern.slice(0, -2);
      return currentPath.startsWith(basePattern);
    }
    
    return false;
  }, [getCurrentPath]);

  return {
    currentTenant,
    getCurrentPath,
    matchesRoute,
  };
};
