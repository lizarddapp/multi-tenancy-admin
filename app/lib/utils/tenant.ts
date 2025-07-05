import { apiClient } from "~/lib/api/client";

// Simple tenant type matching the API response
export interface SimpleTenant {
  id: number;
  name: string;
  slug: string;
  status: string;
}

/**
 * Get the current tenant slug from the URL path
 * Assumes URL pattern is /:tenantSlug/... where tenantSlug is the first path segment
 *
 * @param pathname - The current pathname (e.g., "/acme-corp/users/123")
 * @returns The tenant slug or null if not found
 */
export function getCurrentTenantSlug(pathname: string): string | null {
  const pathSegments = pathname.split("/").filter(Boolean);
  return pathSegments.length > 0 ? pathSegments[0] : null;
}

/**
 * Get the current tenant object from available tenants
 * Uses URL-based detection first, then localStorage fallback, then first available tenant
 *
 * @param tenants - Array of available tenants
 * @param pathname - Current pathname for URL-based detection
 * @returns The current tenant object or null if not found
 */
export function getCurrentTenant(
  tenants: SimpleTenant[],
  pathname: string
): SimpleTenant | null {
  // Return null if no tenants available
  if (!tenants || tenants.length === 0) {
    return null;
  }

  // Extract tenant slug from URL (assuming URL pattern is /:tenantSlug/...)
  const currentSlug = getCurrentTenantSlug(pathname);

  if (currentSlug) {
    const tenant = tenants.find((t) => t.slug === currentSlug);
    if (tenant) return tenant;
  }

  // Fallback to localStorage
  if (typeof window !== "undefined" && window.localStorage) {
    const savedSlug = localStorage.getItem("selected_tenant_slug");
    if (savedSlug) {
      const tenant = tenants.find((t) => t.slug === savedSlug);
      if (tenant) return tenant;
    }
  }

  // Fallback to first available tenant
  return tenants[0] || null;
}

/**
 * Save the selected tenant slug to localStorage
 *
 * @param tenantSlug - The tenant slug to save
 */
export function saveSelectedTenant(tenantSlug: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("selected_tenant_slug", tenantSlug);
  }
}

/**
 * Get the saved tenant slug from localStorage
 *
 * @returns The saved tenant slug or null if not found
 */
export function getSavedTenantSlug(): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    return localStorage.getItem("selected_tenant_slug");
  }
  return null;
}

/**
 * Clear the saved tenant slug from localStorage
 */
export function clearSavedTenant(): void {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("selected_tenant_slug");
  }
}

/**
 * Generate a new path with a different tenant slug
 * Replaces the first path segment (tenant slug) with the new tenant slug
 *
 * @param currentPath - Current pathname (e.g., "/old-tenant/users/123")
 * @param newTenantSlug - New tenant slug to replace with
 * @returns New path with updated tenant slug (e.g., "/new-tenant/users/123")
 *
 * @example
 * generateTenantPath("/acme-corp/users/123", "new-corp") // "/new-corp/users/123"
 * generateTenantPath("/acme-corp", "new-corp") // "/new-corp"
 * generateTenantPath("/", "new-corp") // "/new-corp"
 */
export function generateTenantPath(
  currentPath: string,
  newTenantSlug: string
): string {
  const pathSegments = currentPath.split("/").filter(Boolean);

  if (pathSegments.length > 0) {
    // Replace the first segment (tenant slug) with the new tenant slug
    pathSegments[0] = newTenantSlug;
    return "/" + pathSegments.join("/");
  } else {
    // If no path segments, just navigate to the tenant root
    return `/${newTenantSlug}`;
  }
}

/**
 * Get status badge color classes for tenant status
 *
 * @param status - Tenant status
 * @returns CSS classes for the status badge
 */
export function getTenantStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "trial":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    case "suspended":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
}

/**
 * Check if a tenant is active
 *
 * @param status - Tenant status
 * @returns True if tenant is active
 */
export function isTenantActive(status: string): boolean {
  return status.toLowerCase() === "active";
}

/**
 * Check if a tenant is on trial
 *
 * @param status - Tenant status
 * @returns True if tenant is on trial
 */
export function isTenantOnTrial(status: string): boolean {
  return status.toLowerCase() === "trial";
}

/**
 * Format tenant display name with status
 *
 * @param tenant - Tenant object
 * @returns Formatted display string
 */
export function formatTenantDisplay(tenant: SimpleTenant): string {
  return `${tenant.name} (${tenant.status})`;
}

// =============================================================================
// Axios Header Management Functions
// =============================================================================

/**
 * Set the x-tenant-id header in axios default headers
 *
 * @param tenantId - The tenant ID to set in the header
 */
export function setTenantHeader(tenantId: number | string): void {
  apiClient.defaults.headers.common["x-tenant-id"] = tenantId.toString();
}

/**
 * Get the current x-tenant-id header value
 *
 * @returns The current tenant ID from headers or null if not set
 */
export function getTenantHeader(): string | null {
  const header = apiClient.defaults.headers.common["x-tenant-id"];
  return typeof header === "string" ? header : null;
}

/**
 * Clear the x-tenant-id header from axios default headers
 */
export function clearTenantHeader(): void {
  delete apiClient.defaults.headers.common["x-tenant-id"];
}

/**
 * Check if the x-tenant-id header is currently set
 *
 * @returns True if the header is set, false otherwise
 */
export function hasTenantHeader(): boolean {
  return "x-tenant-id" in apiClient.defaults.headers.common;
}
