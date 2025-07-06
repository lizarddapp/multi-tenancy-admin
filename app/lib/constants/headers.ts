/**
 * HTTP Header constants for multi-tenancy system
 */
export const HEADERS = {
  TENANT_ID: "x-tenant-id",
} as const;

export type HeaderName = (typeof HEADERS)[keyof typeof HEADERS];
