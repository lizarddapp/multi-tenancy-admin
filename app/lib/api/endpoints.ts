// Base URL for the API
export const BASE_URL = "http://localhost:3333/api/v1";

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
  },

  // =================================================================
  // CONTROL ROUTES (/api/v1/control) - Super admin control functionality
  // =================================================================
  CONTROL: {
    // Tenant Management (Super Admin)
    TENANTS: {
      LIST: "/control/tenants",
      CREATE: "/control/tenants",
      GET: (id: number) => `/control/tenants/${id}`,
      UPDATE: (id: number) => `/control/tenants/${id}`,
      DELETE: (id: number) => `/control/tenants/${id}`,
      UPDATE_STATUS: (id: number) => `/control/tenants/${id}/status`,
      ANALYTICS: (id: number) => `/control/tenants/${id}/analytics`,
      SUSPEND: (id: number) => `/control/tenants/${id}/suspend`,
      ACTIVATE: (id: number) => `/control/tenants/${id}/activate`,
      EXTEND_TRIAL: (id: number) => `/control/tenants/${id}/extend-trial`,
      USAGE: (id: number) => `/control/tenants/${id}/usage`,
      BILLING: (id: number) => `/control/tenants/${id}/billing`,
    },

    // System Management
    SYSTEM: {
      SETTINGS: "/control/system/settings",
      UPDATE_SETTINGS: "/control/system/settings",
      HEALTH: "/control/system/health",
      METRICS: "/control/system/metrics",
      LOGS: "/control/system/logs",
      BACKUP: "/control/system/backup",
      BACKUPS: "/control/system/backups",
      RESTORE: (backupId: string) => `/control/system/restore/${backupId}`,
      CLEAR_CACHE: "/control/system/cache/clear",
      CACHE_STATS: "/control/system/cache/stats",
    },

    // Global User Management
    USERS: {
      LIST: "/control/users",
      GET: (id: string) => `/control/users/${id}`,
      UPDATE_STATUS: (id: string) => `/control/users/${id}/status`,
      DELETE: (id: string) => `/control/users/${id}`,
      BULK_SUSPEND: "/control/users/bulk-suspend",
      BULK_ACTIVATE: "/control/users/bulk-activate",
      BULK_DELETE: "/control/users/bulk-delete",
      ANALYTICS: "/control/users/analytics",
      ACTIVITY: (id: string) => `/control/users/${id}/activity`,
    },

    // Billing & Subscriptions
    BILLING: {
      SUBSCRIPTIONS: "/control/billing/subscriptions",
      INVOICES: "/control/billing/invoices",
      PAYMENTS: "/control/billing/payments",
      REFUND: (paymentId: string) => `/control/billing/refund/${paymentId}`,
      UPDATE_SUBSCRIPTION_STATUS: (id: string) =>
        `/control/billing/subscriptions/${id}/status`,
      EXTEND_SUBSCRIPTION: (id: string) =>
        `/control/billing/subscriptions/${id}/extend`,
      REVENUE_ANALYTICS: "/control/billing/analytics/revenue",
      CHURN_ANALYTICS: "/control/billing/analytics/churn",
    },

    // Audit & Compliance
    AUDIT: {
      LOGS: "/control/audit/logs",
      ACTIVITIES: "/control/audit/activities",
      SECURITY_EVENTS: "/control/audit/security-events",
      GDPR_REPORT: "/control/audit/reports/gdpr",
      DATA_USAGE_REPORT: "/control/audit/reports/data-usage",
      EXPORT_REPORT: "/control/audit/reports/export",
    },
  },

  // =================================================================
  // FUTURE ENDPOINTS (To be implemented)
  // =================================================================

  // Dashboard (these endpoints may need to be added to backend)
  DASHBOARD: {
    STATS: "/admin/dashboard/stats",
    RECENT_ACTIVITY: "/admin/dashboard/recent-activity",
    METRICS: "/admin/dashboard/metrics",
  },

  // Users (these endpoints may need to be added to backend)
  USERS: {
    LIST: "/admin/users",
    GET: (id: string) => `/admin/users/${id}`,
    CREATE: "/admin/users",
    UPDATE: (id: string) => `/admin/users/${id}`,
    DELETE: (id: string) => `/admin/users/${id}`,
    BULK_INVITE: "/admin/users/bulk-invite",
    UPDATE_PERMISSIONS: (id: string) => `/admin/users/${id}/permissions`,
  },

  // Analytics (these endpoints may need to be added to backend)
  ANALYTICS: {
    OVERVIEW: "/admin/analytics/overview",
    USAGE: "/admin/analytics/usage",
    REVENUE: "/admin/analytics/revenue",
    CONVERSION: "/admin/analytics/conversion",
  },

  // Products/Services (these endpoints may need to be added to backend)
  PRODUCTS: {
    LIST: "/admin/products",
    CREATE: "/admin/products",
    GET: (id: string) => `/admin/products/${id}`,
    UPDATE: (id: string) => `/admin/products/${id}`,
    DELETE: (id: string) => `/admin/products/${id}`,
  },

  // Settings (these endpoints may need to be added to backend)
  SETTINGS: {
    GENERAL: "/admin/settings/general",
    SECURITY: "/admin/settings/security",
    NOTIFICATIONS: "/admin/settings/notifications",
    BILLING: "/admin/settings/billing",
    INTEGRATIONS: "/admin/settings/integrations",
  },

  // Notifications (these endpoints may need to be added to backend)
  NOTIFICATIONS: {
    LIST: "/admin/notifications",
    MARK_READ: (id: string) => `/admin/notifications/${id}/read`,
    MARK_ALL_READ: "/admin/notifications/mark-all-read",
    DELETE: (id: string) => `/admin/notifications/${id}`,
  },

  // File Upload (these endpoints may need to be added to backend)
  UPLOAD: {
    SINGLE: "/admin/upload/single",
    MULTIPLE: "/admin/upload/multiple",
    AVATAR: "/admin/upload/avatar",
  },

  // Reports (these endpoints may need to be added to backend)
  REPORTS: {
    GENERATE: "/admin/reports/generate",
    DOWNLOAD: (id: string) => `/admin/reports/${id}/download`,
    LIST: "/admin/reports",
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
  },

  // =================================================================
  // CONTROL QUERY KEYS (Super Admin)
  // =================================================================
  CONTROL: {
    // Tenant Management
    TENANTS: ["control", "tenants"] as const,
    TENANT: (id: number) => ["control", "tenants", id] as const,
    TENANT_ANALYTICS: (id: number) =>
      ["control", "tenants", id, "analytics"] as const,
    TENANT_USAGE: (id: number) => ["control", "tenants", id, "usage"] as const,
    TENANT_BILLING: (id: number) =>
      ["control", "tenants", id, "billing"] as const,

    // System Management
    SYSTEM_SETTINGS: ["control", "system", "settings"] as const,
    SYSTEM_HEALTH: ["control", "system", "health"] as const,
    SYSTEM_METRICS: ["control", "system", "metrics"] as const,
    SYSTEM_LOGS: ["control", "system", "logs"] as const,
    SYSTEM_BACKUPS: ["control", "system", "backups"] as const,
    CACHE_STATS: ["control", "system", "cache", "stats"] as const,

    // Global User Management
    USERS: ["control", "users"] as const,
    USER: (id: string) => ["control", "users", id] as const,
    USER_ACTIVITY: (id: string) =>
      ["control", "users", id, "activity"] as const,
    USER_ANALYTICS: ["control", "users", "analytics"] as const,

    // Billing & Subscriptions
    SUBSCRIPTIONS: ["control", "billing", "subscriptions"] as const,
    INVOICES: ["control", "billing", "invoices"] as const,
    PAYMENTS: ["control", "billing", "payments"] as const,
    REVENUE_ANALYTICS: ["control", "billing", "analytics", "revenue"] as const,
    CHURN_ANALYTICS: ["control", "billing", "analytics", "churn"] as const,

    // Audit & Compliance
    AUDIT_LOGS: ["control", "audit", "logs"] as const,
    AUDIT_ACTIVITIES: ["control", "audit", "activities"] as const,
    SECURITY_EVENTS: ["control", "audit", "security-events"] as const,
  },

  // =================================================================
  // FUTURE QUERY KEYS (To be implemented)
  // =================================================================

  // Users
  USERS: ["admin", "users"] as const,
  USER: (id: string) => ["admin", "users", id] as const,

  // Dashboard
  DASHBOARD_STATS: ["admin", "dashboard", "stats"] as const,
  RECENT_ACTIVITY: ["admin", "dashboard", "recent-activity"] as const,
  DASHBOARD_METRICS: ["admin", "dashboard", "metrics"] as const,

  // Analytics
  ANALYTICS_OVERVIEW: ["admin", "analytics", "overview"] as const,
  ANALYTICS_USAGE: ["admin", "analytics", "usage"] as const,
  ANALYTICS_REVENUE: ["admin", "analytics", "revenue"] as const,
  ANALYTICS_CONVERSION: ["admin", "analytics", "conversion"] as const,

  // Products
  PRODUCTS: ["admin", "products"] as const,
  PRODUCT: (id: string) => ["admin", "products", id] as const,

  // Settings
  SETTINGS: (type: string) => ["admin", "settings", type] as const,

  // Notifications
  NOTIFICATIONS: ["admin", "notifications"] as const,

  // Reports
  REPORTS: ["admin", "reports"] as const,

  // Merchants (for existing code compatibility)
  MERCHANTS: ["merchants"] as const,
  MERCHANT: (id: string) => ["merchants", id] as const,
  MERCHANT_ANALYTICS: (id: string) => ["merchants", id, "analytics"] as const,
} as const;
