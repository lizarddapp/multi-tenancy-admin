import { useLocation } from "react-router";
import { useAvailableTenants } from "./useAuth";
import { getCurrentTenant, type SimpleTenant } from "~/lib/utils/tenant";

/**
 * Custom hook to get the current tenant and related functionality
 * Note: Tenant header initialization is handled by TenantInitializer component
 *
 * @returns Object containing current tenant, loading state, and helper functions
 */
export function useTenant() {
  const location = useLocation();
  const { data: tenantsResponse, isLoading, error } = useAvailableTenants();

  const tenants = tenantsResponse?.data?.tenants || [];
  const currentTenant = getCurrentTenant(tenants, location.pathname);

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
