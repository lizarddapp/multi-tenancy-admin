import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { rolesService } from "../api/services/roles";
import { QUERY_KEYS } from "../api/endpoints";
import { STALE_TIME } from "../providers/QueryProvider";
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from "~/types";
import { toast } from "sonner";

// Get all roles
export const useRoles = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.ROLES, params],
    queryFn: () => rolesService.list(params),
  });
};

// Get single role
export const useRole = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.ADMIN.ROLE(id),
    queryFn: () => rolesService.get(id),
    enabled: !!id,
  });
};

// Get all permissions
export const usePermissions = (params?: {
  page?: number;
  limit?: number;
  resource?: string;
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.PERMISSIONS, params],
    queryFn: () => rolesService.getPermissions(params),
  });
};

// Create role mutation
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.ROLES });
      toast.success("Role created successfully");
    },
    onError: (error: any) => {
      console.error("Create role failed:", error);
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });
};

// Update role mutation
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRoleRequest }) =>
      rolesService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.ROLES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.ROLE(id) });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      console.error("Update role failed:", error);
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });
};

// Delete role mutation
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => rolesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.ROLES });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete role failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete role");
    },
  });
};

// Assign permissions mutation
export const useAssignPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: AssignPermissionsRequest;
    }) => rolesService.assignPermissions(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.ROLES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.ROLE(id) });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN.ROLE_PERMISSIONS(id),
      });
      toast.success("Permissions assigned successfully");
    },
    onError: (error: any) => {
      console.error("Assign permissions failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to assign permissions"
      );
    },
  });
};
