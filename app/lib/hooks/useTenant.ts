import { useEffect } from "react";
import { useLocation } from "react-router";
import { useAvailableTenants } from "./useAuth";
import { getCurrentTenant, type SimpleTenant } from "~/lib/utils/tenant";
import { apiClient } from "~/lib/api/client";
import { HEADERS } from "~/lib/constants/headers";

/**
 * Custom hook to get the current tenant and related functionality
 * Automatically sets the x-tenant-id header in axios when tenant is detected
 *
 * @returns Object containing current tenant, loading state, and helper functions
 */
export function useTenant() {
  const location = useLocation();
  const { data: tenantsResponse, isLoading, error } = useAvailableTenants();

  const tenants = tenantsResponse?.data?.tenants || [];
  const currentTenant = getCurrentTenant(tenants, location.pathname);

  // Set axios header when current tenant changes
  useEffect(() => {
    if (currentTenant?.id) {
      // Set the x-tenant-id header for all future requests
      apiClient.defaults.headers.common[HEADERS.TENANT_ID] =
        currentTenant.id.toString();
    } else {
      // Remove the header if no tenant is selected
      delete apiClient.defaults.headers.common[HEADERS.TENANT_ID];
    }

    // Cleanup function to remove header when component unmounts
    return () => {
      delete apiClient.defaults.headers.common[HEADERS.TENANT_ID];
    };
  }, [currentTenant?.id]);

  return {
    // Current tenant data
    currentTenant,
    tenants,

    // Loading and error states
    isLoading,
    error,
    hasTenants: tenants.length > 0,
    hasCurrentTenant: !!currentTenant,

    // Helper functions
    getCurrentTenantSlug: () => currentTenant?.slug || null,
    getCurrentTenantId: () => currentTenant?.id || null,
    getCurrentTenantName: () => currentTenant?.name || null,
    getCurrentTenantStatus: () => currentTenant?.status || null,

    // Find tenant by slug
    findTenantBySlug: (slug: string): SimpleTenant | undefined => {
      return tenants.find((t) => t.slug === slug);
    },

    // Find tenant by id
    findTenantById: (id: number): SimpleTenant | undefined => {
      return tenants.find((t) => t.id === id);
    },
  };
}
