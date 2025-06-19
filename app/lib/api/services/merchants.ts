import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";

export interface Merchant {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "pending";
  created_at: string;
  updated_at: string;
  // Add other merchant fields as needed
}

export interface CreateMerchantRequest {
  name: string;
  email: string;
  // Add other required fields as needed
}

export interface UpdateMerchantRequest {
  name?: string;
  email?: string;
  // Add other updatable fields as needed
}

export interface UpdateMerchantStatusRequest {
  status: "active" | "inactive" | "pending";
}

export interface MerchantAnalytics {
  // Define analytics structure based on backend response
  revenue: number;
  orders: number;
  customers: number;
  growth: {
    revenue: number;
    orders: number;
    customers: number;
  };
}

export interface MerchantsListResponse {
  merchants: Merchant[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface MerchantsListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "pending";
  sortBy?: "name" | "created_at" | "email";
  sortOrder?: "asc" | "desc";
}

export const merchantsService = {
  // Get all merchants with pagination and filters
  getMerchants: async (
    params?: MerchantsListParams
  ): Promise<ApiResponse<MerchantsListResponse>> => {
    const searchParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const url = `${ENDPOINTS.MERCHANTS.LIST}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return api.get<MerchantsListResponse>(url);
  },

  // Get single merchant by ID
  getMerchant: async (id: string): Promise<ApiResponse<Merchant>> => {
    return api.get<Merchant>(ENDPOINTS.MERCHANTS.GET(id));
  },

  // Create new merchant
  createMerchant: async (
    data: CreateMerchantRequest
  ): Promise<ApiResponse<Merchant>> => {
    return api.post<Merchant>(ENDPOINTS.MERCHANTS.CREATE, data);
  },

  // Update merchant
  updateMerchant: async (
    id: string,
    data: UpdateMerchantRequest
  ): Promise<ApiResponse<Merchant>> => {
    return api.patch<Merchant>(ENDPOINTS.MERCHANTS.UPDATE(id), data);
  },

  // Delete merchant
  deleteMerchant: async (id: string): Promise<ApiResponse<null>> => {
    return api.delete<null>(ENDPOINTS.MERCHANTS.DELETE(id));
  },

  // Update merchant status
  updateMerchantStatus: async (
    id: string,
    data: UpdateMerchantStatusRequest
  ): Promise<ApiResponse<Merchant>> => {
    return api.patch<Merchant>(ENDPOINTS.MERCHANTS.UPDATE_STATUS(id), data);
  },

  // Get merchant analytics
  getMerchantAnalytics: async (
    id: string
  ): Promise<ApiResponse<MerchantAnalytics>> => {
    return api.get<MerchantAnalytics>(ENDPOINTS.MERCHANTS.ANALYTICS(id));
  },
};
