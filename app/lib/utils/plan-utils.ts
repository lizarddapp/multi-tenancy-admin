import { Star, Zap, Crown } from "lucide-react";
import { BillingPlan, BillingCycle } from "~/types";
import type { PricingPlan } from "~/lib/api/services/pricing-plans";

/**
 * Plan icons mapping
 */
export const planIcons = {
  free: Star,
  basic: Zap,
  pro: Crown,
  enterprise: Crown,
} as const;

/**
 * Plan order for comparison (lower number = lower tier)
 */
export const planOrder = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
} as const;

/**
 * Get the price for a plan based on the selected cycle
 */
export function getPlanPrice(plan: PricingPlan, cycle: BillingCycle): number {
  return cycle === BillingCycle.YEARLY ? plan.yearlyPrice : plan.monthlyPrice;
}

/**
 * Calculate savings percentage for yearly billing
 */
export function getPlanSavings(plan: PricingPlan, cycle: BillingCycle): number {
  if (cycle === BillingCycle.MONTHLY || plan.monthlyPrice === 0) return 0;

  const yearlyEquivalent = plan.monthlyPrice * 12;
  if (yearlyEquivalent === 0) return 0;

  return Math.round(
    ((yearlyEquivalent - plan.yearlyPrice) / yearlyEquivalent) * 100
  );
}

/**
 * Check if a plan is the current plan
 */
export function isCurrentPlan(
  planSlug: BillingPlan,
  currentPlan: BillingPlan
): boolean {
  return planSlug === currentPlan;
}

/**
 * Check if user can upgrade to a plan
 */
export function canUpgradeToPlan(
  planSlug: BillingPlan,
  currentPlan: BillingPlan
): boolean {
  return planOrder[planSlug] > planOrder[currentPlan];
}

/**
 * Check if user can downgrade to a plan
 */
export function canDowngradeToPlan(
  planSlug: BillingPlan,
  currentPlan: BillingPlan
): boolean {
  return planOrder[planSlug] < planOrder[currentPlan];
}

/**
 * Get the plan icon component
 */
export function getPlanIcon(planSlug: BillingPlan) {
  return planIcons[planSlug as keyof typeof planIcons] || Star;
}

/**
 * Get plan action type (current, upgrade, downgrade, contact)
 */
export function getPlanActionType(
  planSlug: BillingPlan,
  currentPlan: BillingPlan
): "current" | "upgrade" | "downgrade" | "contact" {
  if (isCurrentPlan(planSlug, currentPlan)) return "current";
  if (canUpgradeToPlan(planSlug, currentPlan)) return "upgrade";
  if (canDowngradeToPlan(planSlug, currentPlan)) return "downgrade";
  return "contact";
}

/**
 * Get plan comparison data for a specific plan
 */
export function getPlanComparisonData(
  plan: PricingPlan,
  currentPlan: BillingPlan,
  selectedCycle: BillingCycle
) {
  const price = getPlanPrice(plan, selectedCycle);
  const savings = getPlanSavings(plan, selectedCycle);
  const isCurrent = isCurrentPlan(plan.slug, currentPlan);
  const canUpgrade = canUpgradeToPlan(plan.slug, currentPlan);
  const canDowngrade = canDowngradeToPlan(plan.slug, currentPlan);
  const actionType = getPlanActionType(plan.slug, currentPlan);
  const Icon = getPlanIcon(plan.slug);

  return {
    price,
    savings,
    isCurrent,
    canUpgrade,
    canDowngrade,
    actionType,
    Icon,
  };
}

/**
 * Format plan limits for display
 */
export function formatPlanLimit(value: number | null, unit?: string): string {
  if (value === null) return "Unlimited";
  if (unit) return `${value.toLocaleString()} ${unit}`;
  return value.toLocaleString();
}

/**
 * Get plan features with display formatting
 */
export function getFormattedPlanFeatures(plan: PricingPlan) {
  return plan.features.map((feature) => ({
    ...feature,
    displayName:
      feature.limit && feature.included
        ? `${feature.name} (${feature.limit.toLocaleString()})`
        : feature.name,
  }));
}
