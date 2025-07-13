import { useQuery } from "@tanstack/react-query";
import { pricingPlansService } from "../api/services/pricing-plans";
import { QUERY_KEYS } from "../api/endpoints";
import { STALE_TIME } from "../providers/QueryProvider";
import type { BillingPlan, BillingCycle } from "~/types";

// Get all pricing plans
export const usePricingPlans = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING_PLANS.LIST,
    queryFn: () => pricingPlansService.list(),
    staleTime: STALE_TIME,
  });
};

// Get popular pricing plans
export const usePopularPricingPlans = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING_PLANS.POPULAR,
    queryFn: () => pricingPlansService.popular(),
    staleTime: STALE_TIME,
  });
};

// Get plans comparison data
export const usePricingPlansComparison = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING_PLANS.COMPARISON,
    queryFn: () => pricingPlansService.comparison(),
    staleTime: STALE_TIME,
  });
};

// Get specific pricing plan
export const usePricingPlan = (slug: BillingPlan) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING_PLANS.PLAN(slug),
    queryFn: () => pricingPlansService.get(slug),
    staleTime: STALE_TIME,
    enabled: !!slug,
  });
};

// Get plan price for specific cycle
export const usePlanPrice = (
  slug: BillingPlan,
  cycle: BillingCycle = "monthly"
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING_PLANS.PRICE(slug, cycle),
    queryFn: () => pricingPlansService.getPrice(slug, cycle),
    staleTime: STALE_TIME,
    enabled: !!slug,
  });
};

// Get plan features
export const usePlanFeatures = (slug: BillingPlan) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING_PLANS.FEATURES(slug),
    queryFn: () => pricingPlansService.getFeatures(slug),
    staleTime: STALE_TIME,
    enabled: !!slug,
  });
};

// Get upgrade options for current plan
export const useUpgradeOptions = (slug: BillingPlan) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRICING_PLANS.UPGRADE_OPTIONS(slug),
    queryFn: () => pricingPlansService.getUpgradeOptions(slug),
    staleTime: STALE_TIME,
    enabled: !!slug,
  });
};
