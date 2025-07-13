import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { billingService } from "../api/services/billing";
import { QUERY_KEYS } from "../api/endpoints";
import { STALE_TIME } from "../providers/QueryProvider";
import type {
  CreateBillingRequest,
  UpdateBillingRequest,
  BillingStatus,
  BillingPlan,
  BillingCycle,
} from "~/types";
import { toast } from "sonner";

// Get all billing records (admin)
export const useBilling = (params?: {
  page?: number;
  limit?: number;
  status?: BillingStatus;
  plan?: BillingPlan;
  cycle?: BillingCycle;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.BILLING, params],
    queryFn: () => billingService.list(params),
    staleTime: STALE_TIME.MEDIUM,
  });
};

// Get single billing record
export const useBillingRecord = (id: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.BILLING, id],
    queryFn: () => billingService.get(id),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!id,
  });
};

// Get current tenant's billing
export const useCurrentBilling = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.BILLING.CURRENT],
    queryFn: () => billingService.getCurrent(),
    staleTime: STALE_TIME.MEDIUM,
  });
};

// Get billing by tenant ID
export const useBillingByTenant = (tenantId: number) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.BILLING, "tenant", tenantId],
    queryFn: () => billingService.getByTenant(tenantId),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!tenantId,
  });
};

// Get expiring trials
export const useExpiringTrials = (days: number = 7) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.BILLING, "expiring-trials", days],
    queryFn: () => billingService.getExpiringTrials(days),
    staleTime: STALE_TIME.MEDIUM,
  });
};

// Get overdue subscriptions
export const useOverdueSubscriptions = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN.BILLING, "overdue-subscriptions"],
    queryFn: () => billingService.getOverdueSubscriptions(),
    staleTime: STALE_TIME.MEDIUM,
  });
};

// Create billing mutation
export const useCreateBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBillingRequest) => billingService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.BILLING });
      toast.success("Billing record created successfully");
    },
    onError: (error: any) => {
      console.error("Create billing failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to create billing record"
      );
    },
  });
};

// Update billing mutation
export const useUpdateBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBillingRequest }) =>
      billingService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.BILLING });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BILLING.CURRENT });
      toast.success("Billing record updated successfully");
    },
    onError: (error: any) => {
      console.error("Update billing failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update billing record"
      );
    },
  });
};

// Cancel billing mutation
export const useCancelBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      cancelAtPeriodEnd,
    }: {
      id: number;
      cancelAtPeriodEnd?: boolean;
    }) => billingService.cancel(id, cancelAtPeriodEnd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.BILLING });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BILLING.CURRENT });
      toast.success("Billing subscription cancelled successfully");
    },
    onError: (error: any) => {
      console.error("Cancel billing failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel billing subscription"
      );
    },
  });
};

// Suspend billing mutation
export const useSuspendBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => billingService.suspend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.BILLING });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BILLING.CURRENT });
      toast.success("Billing subscription suspended");
    },
    onError: (error: any) => {
      console.error("Suspend billing failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to suspend billing subscription"
      );
    },
  });
};

// Reactivate billing mutation
export const useReactivateBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => billingService.reactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.BILLING });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.BILLING.CURRENT });
      toast.success("Billing subscription reactivated");
    },
    onError: (error: any) => {
      console.error("Reactivate billing failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to reactivate billing subscription"
      );
    },
  });
};

// Delete billing mutation
export const useDeleteBilling = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => billingService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.BILLING });
      toast.success("Billing record deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete billing failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete billing record"
      );
    },
  });
};
