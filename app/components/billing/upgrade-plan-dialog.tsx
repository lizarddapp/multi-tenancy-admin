import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { BillingPlan, BillingCycle } from "~/types/dashboard";
import { useUpdateBilling } from "~/lib/hooks/useBilling";
import { usePricingPlansComparison } from "~/lib/hooks/usePricingPlans";
import type { PricingPlan } from "~/lib/api/services/pricing-plans";
import { BillingCycleToggle } from "./billing-cycle-toggle";
import { PlanCard } from "./plan-card";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: BillingPlan;
  currentCycle: BillingCycle;
}

export function UpgradePlanDialog({
  open,
  onOpenChange,
  currentPlan,
  currentCycle,
}: UpgradePlanDialogProps) {
  const [selectedCycle, setSelectedCycle] =
    useState<BillingCycle>(currentCycle);
  const updateBilling = useUpdateBilling();
  const { data: plansResponse, isLoading } = usePricingPlansComparison();

  const handlePlanSelect = async (planSlug: string) => {
    const plan = planSlug as BillingPlan;

    if (plan === currentPlan) {
      onOpenChange(false);
      return;
    }

    try {
      await updateBilling.mutateAsync({
        id: 1, // This would be the actual billing ID
        data: {
          plan,
          cycle: selectedCycle,
        },
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to upgrade plan:", error);
    }
  };

  if (isLoading || !(plansResponse as any)?.data?.data) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl">
          <DialogHeader>
            <DialogTitle>Loading Plans...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const plans = (plansResponse as any).data.data;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Your Plan</DialogTitle>
          <DialogDescription>
            Select the plan that best fits your needs. You can change or cancel
            anytime.
          </DialogDescription>
        </DialogHeader>

        <BillingCycleToggle
          selectedCycle={selectedCycle}
          onCycleChange={setSelectedCycle}
          className="py-4"
        />

        {/* Plans Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan: PricingPlan) => (
            <PlanCard
              key={plan.slug}
              plan={plan}
              currentPlan={currentPlan}
              selectedCycle={selectedCycle}
              onPlanSelect={handlePlanSelect}
              isLoading={updateBilling.isPending}
              variant="compact"
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
