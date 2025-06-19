// Export API client and types
export { default as api, apiClient } from "./client";
export type { ApiResponse, ApiError } from "./client";

// Export endpoints and query keys
export { BASE_URL, ENDPOINTS, QUERY_KEYS } from "./endpoints";

// Export services
export { authService, authUtils } from "./services/auth";
export { merchantsService } from "./services/merchants";
export { dashboardService } from "./services/dashboard";

// Export service types
export type {
  LoginResponse,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "./services/auth";

export type {
  Merchant,
  CreateMerchantRequest,
  UpdateMerchantRequest,
  UpdateMerchantStatusRequest,
  MerchantAnalytics,
  MerchantsListResponse,
  MerchantsListParams,
} from "./services/merchants";

export type {
  DashboardStats,
  DashboardMetrics,
  RecentActivity,
} from "./services/dashboard";
