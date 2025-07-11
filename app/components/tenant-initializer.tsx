import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useAvailableTenants, useMyPermissions } from "~/lib/hooks/useAuth";
import { useSession } from "~/lib/providers/SessionProvider";
import {
  getCurrentTenant,
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
  const { isAuthenticated, isLoading: sessionLoading } = useSession();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get available tenants and permissions
  const {
    data: tenantsResponse,
    isLoading: tenantsLoading,
    error: tenantsError,
  } = useAvailableTenants();

  const {
    data: permissionsResponse,
    isLoading: permissionsLoading,
    error: permissionsError,
  } = useMyPermissions();

  const tenants = tenantsResponse?.data?.tenants || [];
  const currentTenant = getCurrentTenant(tenants, location.pathname);

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

    // Check if we have a current tenant
    if (!currentTenant?.id) {
      console.warn("No current tenant found for path:", location.pathname);
      clearTenantHeader();
      setIsInitialized(false);
      return;
    }

    setTenantHeader(currentTenant.id);

    // Wait for permissions to load (only for tenant routes)
    if (permissionsLoading) {
      setIsInitialized(false);
      return;
    }

    // Handle permissions errors
    if (permissionsError) {
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
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTenantHeader();
    };
  }, []);

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
              : permissionsLoading
              ? "Loading permissions..."
              : !currentTenant
              ? "Initializing tenant context..."
              : "Setting up workspace..."}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
