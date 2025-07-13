import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";
import type { DashboardStat, Activity } from "~/types";

export interface DashboardStats {
  totalTenants: DashboardStat;
  activeUsers: DashboardStat;
  monthlyRevenue: DashboardStat;
  systemHealth: DashboardStat;
}

export interface DashboardMetrics {
  conversionRate: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
  averageSession: {
    value: string;
    change: number;
    trend: "up" | "down";
  };
  supportTickets: {
    value: number;
    change: number;
    trend: "up" | "down";
  };
}

export interface RecentActivity {
  activities: Activity[];
  total: number;
}

export const dashboardService = {
  // Get dashboard statistics
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return api.get<DashboardStats>(ENDPOINTS.DASHBOARD.STATS);
  },

  // Get recent activity
  getRecentActivity: async (
    limit: number = 10
  ): Promise<ApiResponse<RecentActivity>> => {
    return api.get<RecentActivity>(
      `${ENDPOINTS.DASHBOARD.RECENT_ACTIVITY}?limit=${limit}`
    );
  },

  // Get dashboard metrics
  getMetrics: async (): Promise<ApiResponse<DashboardMetrics>> => {
    return api.get<DashboardMetrics>(ENDPOINTS.DASHBOARD.METRICS);
  },
};
