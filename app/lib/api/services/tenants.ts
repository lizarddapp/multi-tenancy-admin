import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";
import type {
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  UpdateTenantStatusRequest,
} from "~/types";

export interface TenantsListResponse {
  data: Tenant[];
  pagination?: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasMorePages: boolean;
    hasPages: boolean;
  };
}

export interface TenantAnalyticsResponse {
  usersCount: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  storageUsed: number;
  apiCalls: number;
  lastActivity: string;
}

export const tenantsService = {
  // Get all tenants
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<TenantsListResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);

    const url = `${ENDPOINTS.ADMIN.TENANTS.LIST}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return api.get<TenantsListResponse>(url);
  },

  // Get single tenant
  get: async (id: number): Promise<ApiResponse<{ tenant: Tenant }>> => {
    return api.get<{ tenant: Tenant }>(ENDPOINTS.ADMIN.TENANTS.GET(id));
  },

  // Create new tenant
  create: async (
    data: CreateTenantRequest
  ): Promise<ApiResponse<{ tenant: Tenant }>> => {
    return api.post<{ tenant: Tenant }>(ENDPOINTS.ADMIN.TENANTS.CREATE, data);
  },

  // Create new tenant with auto-generated slug (simplified creation)
  createSimple: async (data: {
    name: string;
  }): Promise<ApiResponse<Tenant>> => {
    return api.post<Tenant>(ENDPOINTS.ADMIN.TENANTS.CREATE_SIMPLE, data);
  },

  // Update tenant
  update: async (
    id: number,
    data: UpdateTenantRequest
  ): Promise<ApiResponse<{ tenant: Tenant }>> => {
    return api.put<{ tenant: Tenant }>(
      ENDPOINTS.ADMIN.TENANTS.UPDATE(id),
      data
    );
  },

  // Delete tenant
  delete: async (id: number): Promise<ApiResponse<null>> => {
    return api.delete<null>(ENDPOINTS.ADMIN.TENANTS.DELETE(id));
  },

  // Update tenant status
  updateStatus: async (
    id: number,
    data: UpdateTenantStatusRequest
  ): Promise<ApiResponse<{ tenant: Tenant }>> => {
    return api.patch<{ tenant: Tenant }>(
      ENDPOINTS.ADMIN.TENANTS.UPDATE_STATUS(id),
      data
    );
  },
};
