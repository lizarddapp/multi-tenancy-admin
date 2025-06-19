import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../api/services/dashboard";
import { QUERY_KEYS } from "../api/endpoints";
import { STALE_TIME } from "../providers/QueryProvider";

// Get dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: dashboardService.getStats,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

// Get recent activity
export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.RECENT_ACTIVITY, limit],
    queryFn: () => dashboardService.getRecentActivity(limit),
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
};

// Get dashboard metrics
export const useDashboardMetrics = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_METRICS,
    queryFn: dashboardService.getMetrics,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};
