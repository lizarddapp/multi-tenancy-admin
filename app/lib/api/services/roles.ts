import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";
import type {
  Role,
  Permission,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from "~/types";

export interface RolesListResponse {
  data: Role[];
  pagination?: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasMorePages: boolean;
    hasPages: boolean;
  };
}

export interface PermissionsListResponse {
  data: Permission[];
  pagination?: {
    currentPage: number;
    perPage: number;
    total: number;
    lastPage: number;
    hasMorePages: boolean;
    hasPages: boolean;
  };
}

export const rolesService = {
  // Get all roles
  list: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ApiResponse<RolesListResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.search) searchParams.set("search", params.search);

    const url = `${ENDPOINTS.ADMIN.ROLES.LIST}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return api.get<RolesListResponse>(url);
  },

  // Get single role
  get: async (id: number): Promise<ApiResponse<{ role: Role }>> => {
    return api.get<{ role: Role }>(ENDPOINTS.ADMIN.ROLES.GET(id));
  },

  // Create new role
  create: async (
    data: CreateRoleRequest
  ): Promise<ApiResponse<{ role: Role }>> => {
    return api.post<{ role: Role }>(ENDPOINTS.ADMIN.ROLES.CREATE, data);
  },

  // Update role
  update: async (
    id: number,
    data: UpdateRoleRequest
  ): Promise<ApiResponse<{ role: Role }>> => {
    return api.put<{ role: Role }>(ENDPOINTS.ADMIN.ROLES.UPDATE(id), data);
  },

  // Delete role
  delete: async (id: number): Promise<ApiResponse<null>> => {
    return api.delete<null>(ENDPOINTS.ADMIN.ROLES.DELETE(id));
  },

  // Get all permissions
  getPermissions: async (params?: {
    page?: number;
    limit?: number;
    resource?: string;
  }): Promise<ApiResponse<PermissionsListResponse>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set("page", params.page.toString());
    if (params?.limit) searchParams.set("limit", params.limit.toString());
    if (params?.resource) searchParams.set("resource", params.resource);

    const url = `${ENDPOINTS.ADMIN.ROLES.PERMISSIONS}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return api.get<PermissionsListResponse>(url);
  },

  // Assign permissions to role
  assignPermissions: async (
    id: number,
    data: AssignPermissionsRequest
  ): Promise<ApiResponse<{ role: Role }>> => {
    return api.post<{ role: Role }>(
      ENDPOINTS.ADMIN.ROLES.ASSIGN_PERMISSIONS(id),
      data
    );
  },
};
