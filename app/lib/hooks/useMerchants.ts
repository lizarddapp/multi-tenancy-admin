import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { merchantsService } from "../api/services/merchants";
import { QUERY_KEYS } from "../api/endpoints";
import { STALE_TIME } from "../providers/QueryProvider";
import type {
  MerchantsListParams,
  CreateMerchantRequest,
  UpdateMerchantRequest,
  UpdateMerchantStatusRequest,
} from "../api/services/merchants";

// Get all merchants
export const useMerchants = (params?: MerchantsListParams) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MERCHANTS, params],
    queryFn: () => merchantsService.getMerchants(params),
  });
};

// Get single merchant
export const useMerchant = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MERCHANT(id),
    queryFn: () => merchantsService.getMerchant(id),
    enabled: !!id,
    // 5 minutes
  });
};

// Create merchant mutation
export const useCreateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchantsService.createMerchant,
    onSuccess: () => {
      // Invalidate merchants list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MERCHANTS });
    },
    onError: (error) => {
      console.error("Create merchant failed:", error);
    },
  });
};

// Update merchant mutation
export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMerchantRequest }) =>
      merchantsService.updateMerchant(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate merchants list and specific merchant
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MERCHANTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MERCHANT(id) });
    },
    onError: (error) => {
      console.error("Update merchant failed:", error);
    },
  });
};

// Delete merchant mutation
export const useDeleteMerchant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: merchantsService.deleteMerchant,
    onSuccess: () => {
      // Invalidate merchants list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MERCHANTS });
    },
    onError: (error) => {
      console.error("Delete merchant failed:", error);
    },
  });
};

// Update merchant status mutation
export const useUpdateMerchantStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateMerchantStatusRequest;
    }) => merchantsService.updateMerchantStatus(id, data),
    onSuccess: (_, { id }) => {
      // Invalidate merchants list and specific merchant
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MERCHANTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MERCHANT(id) });
    },
    onError: (error) => {
      console.error("Update merchant status failed:", error);
    },
  });
};

// Get merchant analytics
export const useMerchantAnalytics = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.MERCHANT_ANALYTICS(id),
    queryFn: () => merchantsService.getMerchantAnalytics(id),
    enabled: !!id,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
  });
};
