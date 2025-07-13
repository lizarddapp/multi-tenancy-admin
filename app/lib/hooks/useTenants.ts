import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tenantsService } from "../api/services/tenants";
import { QUERY_KEYS } from "../api/endpoints";
import type {
  CreateTenantRequest,
  UpdateTenantRequest,
  UpdateTenantStatusRequest,
} from "~/types";
import { toast } from "sonner";

// Get all tenants
export const useTenants = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.TENANTS, params],
    queryFn: () => tenantsService.list(params),
  });
};

// Get single tenant
export const useTenant = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.TENANTS, id],
    queryFn: () => tenantsService.get(id),
    enabled: !!id,
  });
};

// Create tenant mutation
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTenantRequest) => tenantsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TENANTS });
      toast.success("Tenant created successfully");
    },
    onError: (error: any) => {
      console.error("Create tenant failed:", error);
      toast.error(error.response?.data?.message || "Failed to create tenant");
    },
  });
};

// Create tenant with auto-generated slug (simplified creation)
export const useCreateTenantSimple = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string }) => tenantsService.createSimple(data),
    onSuccess: () => {
      // Invalidate available tenants to refresh the list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN.AUTH_AVAILABLE_TENANTS,
      });
      toast.success("Organization created successfully");
    },
    onError: (error: any) => {
      console.error("Create tenant failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to create organization"
      );
    },
  });
};

// Update tenant mutation
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTenantRequest }) =>
      tenantsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TENANTS });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.ADMIN.TENANTS, id],
      });
      toast.success("Tenant updated successfully");
    },
    onError: (error: any) => {
      console.error("Update tenant failed:", error);
      toast.error(error.response?.data?.message || "Failed to update tenant");
    },
  });
};

// Delete tenant mutation
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tenantsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TENANTS });
      toast.success("Tenant deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete tenant failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete tenant");
    },
  });
};

// Update tenant status mutation
export const useUpdateTenantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpdateTenantStatusRequest;
    }) => tenantsService.updateStatus(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.TENANTS });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.ADMIN.TENANTS, id],
      });
      toast.success("Tenant status updated successfully");
    },
    onError: (error: any) => {
      console.error("Update tenant status failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update tenant status"
      );
    },
  });
};
