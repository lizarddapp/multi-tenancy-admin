import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAvailableTenants, useMyPermissions } from "~/lib/hooks/useAuth";
import { useSession } from "~/lib/providers/SessionProvider";
import {
  getCurrentTenant,
  getCurrentTenantSlug,
  setTenantHeader,
  clearTenantHeader,
  type SimpleTenant,
} from "~/lib/utils/tenant";

interface TenantInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that handles tenant context initialization
 * Shows loading state until tenant header is set and permissions are loaded
 */
export function TenantInitializer({ children }: TenantInitializerProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);
  const [tenantHeaderSet, setTenantHeaderSet] = useState(false);
  const queryClient = useQueryClient();

  // Get available tenants
  const {
    data: tenantsResponse,
    isLoading: tenantsLoading,
    error: tenantsError,
  } = useAvailableTenants();

  const tenants = tenantsResponse?.data?.tenants || [];
  const currentTenant = getCurrentTenant(tenants, location.pathname);

  /**
   * Check if the current route is a tenant route (requires tenant context)
   */
  const isTenantRoute = (pathname: string): boolean => {
    // Auth routes don't require tenant context
    if (pathname.startsWith("/_auth")) return false;

    // Control routes don't require tenant context
    if (pathname.startsWith("/_control")) return false;

    // All other routes should have tenant context
    return true;
  };

  /**
   * Get the target tenant for redirection (saved tenant or first available)
   */
  const getTargetTenant = (
    availableTenants: SimpleTenant[]
  ): SimpleTenant | null => {
    if (!availableTenants || availableTenants.length === 0) {
      return null;
    }

    // Try to get saved tenant from localStorage first
    if (typeof window !== "undefined" && window.localStorage) {
      const savedSlug = localStorage.getItem("selected_tenant_slug");
      if (savedSlug) {
        const savedTenant = availableTenants.find((t) => t.slug === savedSlug);
        if (savedTenant) {
          console.log("Found saved tenant in localStorage:", savedSlug);
          return savedTenant;
        }
      }
    }

    // Fallback to first available tenant
    console.log("Using first available tenant:", availableTenants[0].slug);
    return availableTenants[0];
  };

  // Get permissions only when we have a valid tenant and header is set
  // Also ensure we're on a tenant route that requires permissions
  const shouldLoadPermissions =
    tenantHeaderSet && currentTenant?.id && isTenantRoute(location.pathname);

  const {
    data: permissionsResponse,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useMyPermissions(shouldLoadPermissions ? currentTenant?.id : null);

  /**
   * Validate that the route matches the tenant context
   * Ensures the user has access to the tenant and the route structure is valid
   */
  const validateTenantRoute = (
    tenant: SimpleTenant | null,
    pathname: string
  ): boolean => {
    // Skip validation for non-tenant routes
    if (!isTenantRoute(pathname)) {
      return true;
    }

    // Extract tenant slug from URL
    const urlTenantSlug = getCurrentTenantSlug(pathname);

    // Tenant routes must have a tenant slug in URL
    if (!urlTenantSlug) {
      console.warn(`Tenant route missing tenant slug: ${pathname}`);
      return false;
    }

    // If no tenant found but URL has tenant slug, invalid route
    if (!tenant) {
      console.warn(`No tenant found for slug: ${urlTenantSlug}`);
      return false;
    }

    // Check if the URL tenant slug matches the resolved tenant
    if (tenant.slug !== urlTenantSlug) {
      console.warn(
        `Tenant slug mismatch: URL has '${urlTenantSlug}' but resolved tenant is '${tenant.slug}'`
      );
      return false;
    }

    // Check if user has access to this tenant (tenant must be in available tenants list)
    const hasAccess = tenants.some((t) => t.id === tenant.id);
    if (!hasAccess) {
      console.warn(
        `User does not have access to tenant: ${tenant.slug} (ID: ${tenant.id})`
      );
      return false;
    }

    return true;
  };

  // Initialize tenant context
  useEffect(() => {
    // Don't initialize if session is still loading or user is not authenticated
    if (sessionLoading || !isAuthenticated) {
      setIsInitialized(false);
      return;
    }

    // Don't initialize if we're on auth routes
    if (location.pathname.startsWith("/_auth")) {
      setIsInitialized(true);
      return;
    }

    // Don't initialize if we're on control routes (super admin)
    if (location.pathname.startsWith("/_control")) {
      clearTenantHeader();
      setTenantHeaderSet(false);
      setIsInitialized(true);
      return;
    }

    // Wait for tenants to load
    if (tenantsLoading) {
      setIsInitialized(false);
      return;
    }

    // Handle tenant errors
    if (tenantsError) {
      console.error("Failed to load tenants:", tenantsError);
      setIsInitialized(false);
      return;
    }

    // Validate tenant route before proceeding
    if (
      isTenantRoute(location.pathname) &&
      !validateTenantRoute(currentTenant, location.pathname)
    ) {
      console.error("Invalid tenant route:", location.pathname);
      clearTenantHeader();
      setTenantHeaderSet(false);

      // Redirect to saved tenant or first available tenant
      const targetTenant = getTargetTenant(tenants);
      if (targetTenant) {
        const newPath = `/${targetTenant.slug}/dashboard`;
        console.log("Redirecting to tenant route:", newPath);
        navigate(newPath, { replace: true });
      } else {
        // No tenants available, redirect to login
        console.log("No tenants available, redirecting to login");
        navigate("/_auth/login", { replace: true });
      }

      setIsInitialized(false);
      return;
    }

    // Check if we have a current tenant
    if (!currentTenant?.id) {
      console.warn("No current tenant found for path:", location.pathname);
      clearTenantHeader();
      setTenantHeaderSet(false);

      // If this is a tenant route but no tenant found, redirect to saved/first tenant
      if (isTenantRoute(location.pathname)) {
        const targetTenant = getTargetTenant(tenants);
        if (targetTenant) {
          const newPath = `/${targetTenant.slug}/dashboard`;
          console.log("Redirecting to tenant route:", newPath);
          navigate(newPath, { replace: true });
        }
      }

      setIsInitialized(false);
      return;
    }

    // Set tenant header and mark it as set
    setTenantHeader(currentTenant.id);

    setTenantHeaderSet(true);

    // Wait for permissions to load (only for tenant routes and when tenant header is set)
    if (shouldLoadPermissions && permissionsLoading) {
      setIsInitialized(false);
      return;
    }

    // Handle permissions errors (only when we're trying to load permissions)
    if (shouldLoadPermissions && permissionsError) {
      console.error("Failed to load permissions:", permissionsError);
      setIsInitialized(false);
      return;
    }

    // Everything is ready
    setIsInitialized(true);
  }, [
    sessionLoading,
    isAuthenticated,
    location.pathname,
    tenantsLoading,
    tenantsError,
    currentTenant?.id,
    permissionsLoading,
    permissionsError,
    tenants,
    navigate,
    validateTenantRoute,
    isTenantRoute,
    getTargetTenant,
    tenantHeaderSet,
    shouldLoadPermissions,
  ]);

  // invalidate queries when tenant changes
  useEffect(() => {
    queryClient.invalidateQueries();
  }, [currentTenant]);

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div className="text-sm text-muted-foreground">
            {sessionLoading
              ? "Loading session..."
              : tenantsLoading
              ? "Loading tenants..."
              : tenantsError
              ? "Failed to load tenants"
              : !tenantHeaderSet
              ? "Setting tenant context..."
              : shouldLoadPermissions && permissionsLoading
              ? "Loading permissions..."
              : shouldLoadPermissions && permissionsError
              ? "Failed to load permissions"
              : !currentTenant
              ? "Validating tenant access..."
              : "Setting up workspace..."}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
