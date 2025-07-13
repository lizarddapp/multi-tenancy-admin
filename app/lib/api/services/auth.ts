import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";
import type { LoginFormData, AuthUser, UserRole } from "~/types";

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  expiresIn: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  tenantId?: number;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AvailableTenantsResponse {
  tenants: Array<{
    id: number;
    name: string;
    slug: string;
    status: string;
  }>;
}

export interface MyPermissionsResponse {
  permissions: string[];
}

export const authService = {
  // Register user
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<LoginResponse>> => {
    return api.post<LoginResponse>(ENDPOINTS.ADMIN.AUTH.REGISTER, data);
  },

  // Login user
  login: async (
    credentials: LoginFormData
  ): Promise<ApiResponse<LoginResponse>> => {
    return api.post<LoginResponse>(ENDPOINTS.ADMIN.AUTH.LOGIN, {
      email: credentials.email,
      password: credentials.password,
    });
  },

  // Logout user
  logout: async (): Promise<ApiResponse<null>> => {
    return api.post<null>(ENDPOINTS.ADMIN.AUTH.LOGOUT);
  },

  // Get current user profile
  getProfile: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    return api.get<{ user: AuthUser }>(ENDPOINTS.ADMIN.AUTH.PROFILE);
  },

  // Update user profile
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ApiResponse<{ user: AuthUser }>> => {
    return api.post<{ user: AuthUser }>(
      ENDPOINTS.ADMIN.AUTH.UPDATE_PROFILE,
      data
    );
  },

  // Change password
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<ApiResponse<null>> => {
    return api.post<null>(ENDPOINTS.ADMIN.AUTH.CHANGE_PASSWORD, data);
  },

  // Verify token
  verifyToken: async (): Promise<ApiResponse<{ user: AuthUser }>> => {
    return api.get<{ user: AuthUser }>(ENDPOINTS.ADMIN.AUTH.VERIFY_TOKEN);
  },

  // Get available tenants for user
  getAvailableTenants: async (): Promise<
    ApiResponse<AvailableTenantsResponse>
  > => {
    return api.get<AvailableTenantsResponse>(
      ENDPOINTS.ADMIN.AUTH.AVAILABLE_TENANTS
    );
  },

  // Get user permissions for current tenant context
  getMyPermissions: async (
    tenantId?: number
  ): Promise<ApiResponse<MyPermissionsResponse>> => {
    return api.get<MyPermissionsResponse>(
      ENDPOINTS.ADMIN.AUTH.GET_MY_PERMISSIONS,
      {
        headers: {
          "X-Tenant-Id": tenantId?.toString() || "", // TODO: Get from tenant context
        },
      }
    );
  },
};

// Auth utility functions
export const authUtils = {
  // Store auth token
  storeToken: (token: string) => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("auth_token", token);
    }
  },

  // Clear auth token
  clearToken: () => {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem("auth_token");
    }
  },

  // Get stored token
  getToken: (): string | null => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};
