import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
} from "~/types/dashboard";

export interface UsersListResponse {
  data: User[];
  pagination: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasMorePages: boolean;
    hasPages: boolean;
  };
}

export const usersService = {
  // Get all users
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ApiResponse<UsersListResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);

    const url = `${ENDPOINTS.USERS.LIST}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return api.get<UsersListResponse>(url);
  },

  // Get single user
  get: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    return api.get<{ user: User }>(ENDPOINTS.USERS.GET(id));
  },

  // Create new user
  create: async (
    data: CreateUserRequest
  ): Promise<ApiResponse<{ user: User }>> => {
    return api.post<{ user: User }>(ENDPOINTS.USERS.CREATE, data);
  },

  // Update user
  update: async (
    id: string,
    data: UpdateUserRequest
  ): Promise<ApiResponse<{ user: User }>> => {
    return api.put<{ user: User }>(ENDPOINTS.USERS.UPDATE(id), data);
  },

  // Update user status
  updateStatus: async (
    id: string,
    data: UpdateUserStatusRequest
  ): Promise<ApiResponse<{ user: User }>> => {
    return api.patch<{ user: User }>(ENDPOINTS.USERS.UPDATE_STATUS(id), data);
  },

  // Delete user
  delete: async (id: string): Promise<ApiResponse<null>> => {
    return api.delete<null>(ENDPOINTS.USERS.DELETE(id));
  },

  // Invite user
  invite: async (
    data: CreateUserRequest
  ): Promise<ApiResponse<{ user: User }>> => {
    return api.post<{ user: User }>(ENDPOINTS.USERS.INVITE, data);
  },

  // Bulk invite users
  bulkInvite: async (data: {
    users: CreateUserRequest[];
  }): Promise<ApiResponse<{ results: any[] }>> => {
    return api.post<{ results: any[] }>(ENDPOINTS.USERS.BULK_INVITE, data);
  },

  // Update user permissions
  updatePermissions: async (
    id: string,
    data: { permissionIds: number[] }
  ): Promise<ApiResponse<null>> => {
    const response = await api.put(
      `${ENDPOINTS.USERS.UPDATE_PERMISSIONS(id)}`,
      data
    );
    return response.data;
  },
};
