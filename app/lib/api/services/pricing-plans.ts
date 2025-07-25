import api from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../client";
import type { BillingPlan, BillingCycle } from "~/types";

export interface PlanFeature {
  name: string;
  description: string;
  included: boolean;
  limit?: number | null;
}

export interface PlanLimits {
  maxUsers: number | null;
  maxStorage: number | null;
  maxApiCalls: number | null;
  maxProjects: number | null;
}

export interface PricingPlan {
  id: number;
  name: string;
  slug: BillingPlan;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  isPopular: boolean;
  features: PlanFeature[];
  limits: PlanLimits;
  trialDays: number;
  yearlySavings: number;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanPrice {
  slug: BillingPlan;
  cycle: BillingCycle;
  price: number;
  currency: string;
}

export interface PlanFeatures {
  slug: BillingPlan;
  features: PlanFeature[];
}

export interface UpgradeOptions {
  currentPlan: BillingPlan;
  canUpgrade: boolean;
  nextUpgrade: {
    id: number;
    name: string;
    slug: BillingPlan;
    monthlyPrice: number;
    yearlyPrice: number;
  } | null;
  upgradePlans: PricingPlan[];
}

export const pricingPlansService = {
  // Get all active pricing plans
  list: async (): Promise<ApiResponse<{ data: PricingPlan[] }>> => {
    return api.get<{ data: PricingPlan[] }>(ENDPOINTS.PRICING_PLANS.LIST);
  },

  // Get popular pricing plans
  popular: async (): Promise<ApiResponse<{ data: PricingPlan[] }>> => {
    return api.get<{ data: PricingPlan[] }>(ENDPOINTS.PRICING_PLANS.POPULAR);
  },

  // Get plans comparison data
  comparison: async (): Promise<ApiResponse<{ data: PricingPlan[] }>> => {
    return api.get<{ data: PricingPlan[] }>(ENDPOINTS.PRICING_PLANS.COMPARISON);
  },

  // Get specific pricing plan by slug
  get: async (
    slug: BillingPlan
  ): Promise<ApiResponse<{ data: PricingPlan }>> => {
    return api.get<{ data: PricingPlan }>(ENDPOINTS.PRICING_PLANS.GET(slug));
  },

  // Get plan price for specific cycle
  getPrice: async (
    slug: BillingPlan,
    cycle: BillingCycle = "monthly"
  ): Promise<ApiResponse<{ data: PlanPrice }>> => {
    const url = `${ENDPOINTS.PRICING_PLANS.PRICE(slug)}?cycle=${cycle}`;
    return api.get<{ data: PlanPrice }>(url);
  },

  // Get plan features
  getFeatures: async (
    slug: BillingPlan
  ): Promise<ApiResponse<{ data: PlanFeatures }>> => {
    return api.get<{ data: PlanFeatures }>(
      ENDPOINTS.PRICING_PLANS.FEATURES(slug)
    );
  },

  // Get upgrade options for current plan
  getUpgradeOptions: async (
    slug: BillingPlan
  ): Promise<ApiResponse<{ data: UpgradeOptions }>> => {
    return api.get<{ data: UpgradeOptions }>(
      ENDPOINTS.PRICING_PLANS.UPGRADE_OPTIONS(slug)
    );
  },
};
