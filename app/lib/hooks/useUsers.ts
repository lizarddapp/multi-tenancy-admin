import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../api/services/users";
import { QUERY_KEYS } from "../api/endpoints";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  InviteUserRequest,
} from "~/types/dashboard";
import { toast } from "sonner";
import { getErrorMessage } from "~/lib/utils/error";

// Get all users
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, params],
    queryFn: () => usersService.list(params),
  });
};

// Get single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.USERS, id],
    queryFn: () => usersService.get(id),
    enabled: !!id,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserRequest) => usersService.create(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success(response.message || "User created successfully");
    },
    onError: (error: any) => {
      console.error("Create user error:", error);
      const message = getErrorMessage(error, "Failed to create user");
      toast.error(message);
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      usersService.update(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USERS, variables.id],
      });
      toast.success(response.message || "User updated successfully");
    },
    onError: (error: any) => {
      console.error("Update user error:", error);
      const message = getErrorMessage(error, "Failed to update user");
      toast.error(message);
    },
  });
};

// Update user status mutation
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserStatusRequest }) =>
      usersService.updateStatus(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.USERS, variables.id],
      });
      toast.success(response.message || "User status updated successfully");
    },
    onError: (error: any) => {
      console.error("Update user status error:", error);
      const message = getErrorMessage(error, "Failed to update user status");
      toast.error(message);
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success(response.message || "User deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete user error:", error);
      const message = getErrorMessage(error, "Failed to delete user");
      toast.error(message);
    },
  });
};

// Invite user mutation
export const useInviteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) => usersService.invite(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success(response.message || "User invited successfully");
    },
    onError: (error: any) => {
      console.error("Invite user error:", error);
      const message = getErrorMessage(error, "Failed to invite user");
      toast.error(message);
    },
  });
};

// User permissions management
export const useUpdateUserPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      permissionIds,
    }: {
      id: string;
      permissionIds: number[];
    }) => usersService.updatePermissions(id, { permissionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      console.error("Error updating user permissions:", error);
    },
  });
};

// Bulk invite users mutation
export const useBulkInviteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { users: CreateUserRequest[] }) =>
      usersService.bulkInvite(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS });
      toast.success(response.message || "Users invited successfully");
    },
    onError: (error: any) => {
      console.error("Bulk invite users error:", error);
      const message = getErrorMessage(error, "Failed to invite users");
      toast.error(message);
    },
  });
};
