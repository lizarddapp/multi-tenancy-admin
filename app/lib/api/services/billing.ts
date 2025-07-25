import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";
import type {
  Billing,
  CreateBillingRequest,
  UpdateBillingRequest,
  BillingStatus,
  BillingPlan,
  BillingCycle,
} from "~/types";

export interface BillingListResponse {
  data: Billing[];
  pagination?: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasMorePages: boolean;
    hasPages: boolean;
  };
}

export const billingService = {
  // Get all billing records (admin)
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: BillingStatus;
    plan?: BillingPlan;
    cycle?: BillingCycle;
    search?: string;
  }): Promise<ApiResponse<BillingListResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.status) searchParams.set("status", params.status);
    if (params?.plan) searchParams.set("plan", params.plan);
    if (params?.cycle) searchParams.set("cycle", params.cycle);
    if (params?.search) searchParams.set("search", params.search);

    const url = `${ENDPOINTS.ADMIN.BILLING.LIST}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return api.get<BillingListResponse>(url);
  },

  // Get single billing record
  get: async (id: number): Promise<ApiResponse<{ data: Billing }>> => {
    return api.get<{ data: Billing }>(ENDPOINTS.ADMIN.BILLING.GET(id));
  },

  // Create new billing record
  create: async (
    data: CreateBillingRequest
  ): Promise<ApiResponse<{ data: Billing }>> => {
    return api.post<{ data: Billing }>(ENDPOINTS.ADMIN.BILLING.CREATE, data);
  },

  // Update billing record
  update: async (
    id: number,
    data: UpdateBillingRequest
  ): Promise<ApiResponse<{ data: Billing }>> => {
    return api.put<{ data: Billing }>(ENDPOINTS.ADMIN.BILLING.UPDATE(id), data);
  },

  // Cancel billing subscription
  cancel: async (
    id: number,
    cancelAtPeriodEnd: boolean = true
  ): Promise<ApiResponse<{ data: Billing }>> => {
    return api.post<{ data: Billing }>(ENDPOINTS.ADMIN.BILLING.CANCEL(id), {
      cancelAtPeriodEnd,
    });
  },

  // Suspend billing
  suspend: async (id: number): Promise<ApiResponse<{ data: Billing }>> => {
    return api.post<{ data: Billing }>(ENDPOINTS.ADMIN.BILLING.SUSPEND(id));
  },

  // Reactivate billing
  reactivate: async (id: number): Promise<ApiResponse<{ data: Billing }>> => {
    return api.post<{ data: Billing }>(ENDPOINTS.ADMIN.BILLING.REACTIVATE(id));
  },

  // Get billing by tenant ID
  getByTenant: async (
    tenantId: number
  ): Promise<ApiResponse<{ data: Billing }>> => {
    return api.get<{ data: Billing }>(
      ENDPOINTS.ADMIN.BILLING.GET_BY_TENANT(tenantId)
    );
  },

  // Get current tenant's billing
  getCurrent: async (): Promise<ApiResponse<Billing>> => {
    return api.get<Billing>(ENDPOINTS.BILLING.CURRENT);
  },

  // Get expiring trials
  getExpiringTrials: async (
    days: number = 7
  ): Promise<ApiResponse<{ data: Billing[]; count: number }>> => {
    return api.get<{ data: Billing[]; count: number }>(
      `${ENDPOINTS.ADMIN.BILLING.EXPIRING_TRIALS}?days=${days}`
    );
  },

  // Get overdue subscriptions
  getOverdueSubscriptions: async (): Promise<
    ApiResponse<{ data: Billing[]; count: number }>
  > => {
    return api.get<{ data: Billing[]; count: number }>(
      ENDPOINTS.ADMIN.BILLING.OVERDUE_SUBSCRIPTIONS
    );
  },

  // Delete billing record
  delete: async (id: number): Promise<ApiResponse<null>> => {
    return api.delete<null>(ENDPOINTS.ADMIN.BILLING.DELETE(id));
  },
};
