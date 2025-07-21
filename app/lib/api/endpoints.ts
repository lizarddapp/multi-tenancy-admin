// Base URL for the API
export const BASE_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:3333"
}/api/v1`;

// API Endpoints organized by route groups
export const ENDPOINTS = {
  // =================================================================
  // ADMIN ROUTES (/api/v1/admin) - Admin dashboard functionality
  // =================================================================
  ADMIN: {
    // Public routes (no auth required)
    AUTH: {
      REGISTER: "/admin/auth/register",
      LOGIN: "/admin/auth/login",
      FORGOT_PASSWORD: "/admin/auth/forgot-password",
      RESET_PASSWORD: "/admin/auth/reset-password",
      // Protected auth routes
      PROFILE: "/admin/auth/profile",
      UPDATE_PROFILE: "/admin/auth/update-profile",
      CHANGE_PASSWORD: "/admin/auth/change-password",
      LOGOUT: "/admin/auth/logout",
      VERIFY_TOKEN: "/admin/auth/verify-token",
      AVAILABLE_TENANTS: "/admin/auth/tenants",
      GET_MY_PERMISSIONS: "/admin/auth/get-my-permissions",
    },

    // Role and Permission Management
    ROLES: {
      LIST: "/admin/roles",
      CREATE: "/admin/roles",
      GET: (id: number) => `/admin/roles/${id}`,
      UPDATE: (id: number) => `/admin/roles/${id}`,
      DELETE: (id: number) => `/admin/roles/${id}`,
      ASSIGN_PERMISSIONS: (id: number) => `/admin/roles/${id}/permissions`,
      PERMISSIONS: "/admin/permissions",
    },

    // User Role Management
    USER_ROLES: {
      LIST: (userId: string) => `/admin/users/${userId}/roles`,
      ASSIGN: (userId: string) => `/admin/users/${userId}/roles`,
      REMOVE: (userId: string) => `/admin/users/${userId}/roles`,
      PERMISSIONS: (userId: string) =>
        `/admin/users/${userId}/roles/permissions`,
      BULK_ASSIGN: (userId: string) =>
        `/admin/users/${userId}/roles/bulk-assign`,
    },

    // Tenant Management (Admin)
    TENANTS: {
      LIST: "/admin/tenants",
      CREATE: "/admin/tenants",
      GET: (id: number) => `/admin/tenants/${id}`,
      UPDATE: (id: number) => `/admin/tenants/${id}`,
      DELETE: (id: number) => `/admin/tenants/${id}`,
      UPDATE_STATUS: (id: number) => `/admin/tenants/${id}/status`,
      CREATE_SIMPLE: "/admin/tenants/create-simple",
    },

    // Billing Management (Admin)
    BILLING: {
      LIST: "/admin/billing",
      CREATE: "/admin/billing",
      GET: (id: number) => `/admin/billing/${id}`,
      UPDATE: (id: number) => `/admin/billing/${id}`,
      DELETE: (id: number) => `/admin/billing/${id}`,
      CANCEL: (id: number) => `/admin/billing/${id}/cancel`,
      SUSPEND: (id: number) => `/admin/billing/${id}/suspend`,
      REACTIVATE: (id: number) => `/admin/billing/${id}/reactivate`,
      GET_BY_TENANT: (tenantId: number) => `/admin/billing/tenant/${tenantId}`,
      EXPIRING_TRIALS: "/admin/billing/reports/expiring-trials",
      OVERDUE_SUBSCRIPTIONS: "/admin/billing/reports/overdue-subscriptions",
    },
  },

  // Tenant-scoped endpoints
  BILLING: {
    CURRENT: "/admin/my-billing",
  },

  // Public pricing plans endpoints (no auth required)
  PRICING_PLANS: {
    LIST: "/admin/pricing-plans",
    POPULAR: "/admin/pricing-plans/popular",
    COMPARISON: "/admin/pricing-plans/comparison",
    GET: (slug: string) => `/admin/pricing-plans/${slug}`,
    PRICE: (slug: string) => `/admin/pricing-plans/${slug}/price`,
    FEATURES: (slug: string) => `/admin/pricing-plans/${slug}/features`,
    UPGRADE_OPTIONS: (slug: string) =>
      `/admin/pricing-plans/${slug}/upgrade-options`,
  },

  // Users - These endpoints are implemented in backend
  USERS: {
    LIST: "/admin/users",
    GET: (id: string) => `/admin/users/${id}`,
    CREATE: "/admin/users",
    UPDATE: (id: string) => `/admin/users/${id}`,
    DELETE: (id: string) => `/admin/users/${id}`,
    UPDATE_STATUS: (id: string) => `/admin/users/${id}/status`,
    INVITE: "/admin/users/invite",
    BULK_INVITE: "/admin/users/bulk-invite",
    UPDATE_PERMISSIONS: (id: string) => `/admin/users/${id}/permissions`,
  },
} as const;

// Query Keys for React Query - Organized by route groups
export const QUERY_KEYS = {
  // =================================================================
  // ADMIN QUERY KEYS
  // =================================================================
  ADMIN: {
    // Authentication
    AUTH_USER: ["admin", "auth", "user"] as const,
    AUTH_AVAILABLE_TENANTS: ["admin", "auth", "available-tenants"] as const,
    AUTH_MY_PERMISSIONS: ["admin", "auth", "my-permissions"] as const,

    // Roles and Permissions
    ROLES: ["admin", "roles"] as const,
    ROLE: (id: number) => ["admin", "roles", id] as const,
    PERMISSIONS: ["admin", "permissions"] as const,
    ROLE_PERMISSIONS: (id: number) =>
      ["admin", "roles", id, "permissions"] as const,

    // User Roles
    USER_ROLES: (userId: string) =>
      ["admin", "users", userId, "roles"] as const,
    USER_PERMISSIONS: (userId: string) =>
      ["admin", "users", userId, "permissions"] as const,

    // Billing
    BILLING: ["admin", "billing"] as const,

    // Tenants
    TENANTS: ["admin", "tenants"] as const,
  },

  // =================================================================
  // TENANT-SCOPED QUERY KEYS
  // =================================================================
  BILLING: {
    CURRENT: ["billing", "current"] as const,
  },

  // =================================================================
  // PUBLIC QUERY KEYS (No auth required)
  // =================================================================
  PRICING_PLANS: {
    LIST: ["pricing-plans"] as const,
    POPULAR: ["pricing-plans", "popular"] as const,
    COMPARISON: ["pricing-plans", "comparison"] as const,
    PLAN: (slug: string) => ["pricing-plans", slug] as const,
    PRICE: (slug: string, cycle?: string) =>
      ["pricing-plans", slug, "price", cycle] as const,
    FEATURES: (slug: string) => ["pricing-plans", slug, "features"] as const,
    UPGRADE_OPTIONS: (slug: string) =>
      ["pricing-plans", slug, "upgrade-options"] as const,
  },

  // =================================================================
  // IMPLEMENTED QUERY KEYS
  // =================================================================

  // Users
  USERS: ["admin", "users"] as const,
  USER: (id: string) => ["admin", "users", id] as const,
} as const;
