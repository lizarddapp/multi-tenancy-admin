// Base URL for the API
export const BASE_URL = "http://localhost:3333/api/v1";

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
    UPDATE_PROFILE: "/auth/update-profile",
    CHANGE_PASSWORD: "/auth/change-password",
    LOGOUT: "/auth/logout",
    VERIFY_TOKEN: "/auth/verify-token",
    AVAILABLE_TENANTS: "/auth/tenants",
    SWITCH_TENANT: "/auth/switch-tenant",
  },

  // Dashboard (these endpoints may need to be added to backend)
  DASHBOARD: {
    STATS: "/dashboard/stats",
    RECENT_ACTIVITY: "/dashboard/recent-activity",
    METRICS: "/dashboard/metrics",
  },

  // Users (these endpoints may need to be added to backend)
  USERS: {
    LIST: "/users",
    CREATE: "/users",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    INVITE: "/users/invite",
    BULK_INVITE: "/users/bulk-invite",
  },

  // Analytics (these endpoints may need to be added to backend)
  ANALYTICS: {
    OVERVIEW: "/analytics/overview",
    USAGE: "/analytics/usage",
    REVENUE: "/analytics/revenue",
    CONVERSION: "/analytics/conversion",
  },

  // Products/Services (these endpoints may need to be added to backend)
  PRODUCTS: {
    LIST: "/products",
    CREATE: "/products",
    GET: (id: string) => `/products/${id}`,
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },

  // Settings (these endpoints may need to be added to backend)
  SETTINGS: {
    GENERAL: "/settings/general",
    SECURITY: "/settings/security",
    NOTIFICATIONS: "/settings/notifications",
    BILLING: "/settings/billing",
    INTEGRATIONS: "/settings/integrations",
  },

  // Notifications (these endpoints may need to be added to backend)
  NOTIFICATIONS: {
    LIST: "/notifications",
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: "/notifications/mark-all-read",
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // File Upload (these endpoints may need to be added to backend)
  UPLOAD: {
    SINGLE: "/upload/single",
    MULTIPLE: "/upload/multiple",
    AVATAR: "/upload/avatar",
  },

  // Reports (these endpoints may need to be added to backend)
  REPORTS: {
    GENERATE: "/reports/generate",
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    LIST: "/reports",
  },

  // Roles and Permissions
  ROLES: {
    LIST: "/roles",
    CREATE: "/roles",
    GET: (id: number) => `/roles/${id}`,
    UPDATE: (id: number) => `/roles/${id}`,
    DELETE: (id: number) => `/roles/${id}`,
    ASSIGN_PERMISSIONS: (id: number) => `/roles/${id}/permissions`,
    PERMISSIONS: "/roles/permissions",
  },

  // Tenants
  TENANTS: {
    LIST: "/tenants",
    CREATE: "/tenants",
    GET: (id: number) => `/tenants/${id}`,
    UPDATE: (id: number) => `/tenants/${id}`,
    DELETE: (id: number) => `/tenants/${id}`,
    UPDATE_STATUS: (id: number) => `/tenants/${id}/status`,
    ANALYTICS: (id: number) => `/tenants/${id}/analytics`,
  },
} as const;

// Query Keys for React Query
export const QUERY_KEYS = {
  // Authentication
  AUTH_USER: ["auth", "user"] as const,
  AUTH_AVAILABLE_TENANTS: ["auth", "available-tenants"] as const,

  // Users
  USERS: ["users"] as const,
  USER: (id: string) => ["users", id] as const,

  // Dashboard
  DASHBOARD_STATS: ["dashboard", "stats"] as const,
  RECENT_ACTIVITY: ["dashboard", "recent-activity"] as const,
  DASHBOARD_METRICS: ["dashboard", "metrics"] as const,

  // Analytics
  ANALYTICS_OVERVIEW: ["analytics", "overview"] as const,
  ANALYTICS_USAGE: ["analytics", "usage"] as const,
  ANALYTICS_REVENUE: ["analytics", "revenue"] as const,
  ANALYTICS_CONVERSION: ["analytics", "conversion"] as const,

  // Products
  PRODUCTS: ["products"] as const,
  PRODUCT: (id: string) => ["products", id] as const,

  // Settings
  SETTINGS: (type: string) => ["settings", type] as const,

  // Notifications
  NOTIFICATIONS: ["notifications"] as const,

  // Reports
  REPORTS: ["reports"] as const,

  // Roles and Permissions
  ROLES: ["roles"] as const,
  ROLE: (id: number) => ["roles", id] as const,
  PERMISSIONS: ["permissions"] as const,
  ROLE_PERMISSIONS: (id: number) => ["roles", id, "permissions"] as const,

  // Tenants
  TENANTS: ["tenants"] as const,
  TENANT: (id: number) => ["tenants", id] as const,
  TENANT_ANALYTICS: (id: number) => ["tenants", id, "analytics"] as const,

  // Merchants (for existing code compatibility)
  MERCHANTS: ["merchants"] as const,
  MERCHANT: (id: string) => ["merchants", id] as const,
  MERCHANT_ANALYTICS: (id: string) => ["merchants", id, "analytics"] as const,
} as const;
