import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { usePricingPlansComparison } from "~/lib/hooks/usePricingPlans";
import { useUpdateBilling } from "~/lib/hooks/useBilling";
import { BillingPlan, BillingCycle } from "~/types/dashboard";
import type { PricingPlan } from "~/lib/api/services/pricing-plans";
import { BillingCycleToggle } from "./billing-cycle-toggle";
import { PlanCard } from "./plan-card";

interface PricingPlansSectionProps {
  currentPlan: BillingPlan;
  currentCycle: BillingCycle;
  onPlanSelect?: (plan: BillingPlan, cycle: BillingCycle) => void;
}

export function PricingPlansSection({
  currentPlan,
  currentCycle,
  onPlanSelect,
}: PricingPlansSectionProps) {
  const [selectedCycle, setSelectedCycle] =
    useState<BillingCycle>(currentCycle);
  const { data: plansResponse, isLoading, error } = usePricingPlansComparison();
  const updateBilling = useUpdateBilling();

  const handlePlanSelect = async (planSlug: string) => {
    const plan = planSlug as BillingPlan;

    if (plan === currentPlan) return;

    if (onPlanSelect) {
      onPlanSelect(plan, selectedCycle);
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
    } catch (error) {
      console.error("Failed to upgrade plan:", error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            Choose the plan that best fits your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <div className="space-y-2">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !(plansResponse as any)?.data?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to load pricing plans. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const plans = (plansResponse as any).data.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Plans</CardTitle>
        <CardDescription>
          Choose the plan that best fits your needs. You can upgrade or
          downgrade at any time.
        </CardDescription>

        <BillingCycleToggle
          selectedCycle={selectedCycle}
          onCycleChange={setSelectedCycle}
        />
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan: PricingPlan) => (
            <PlanCard
              key={plan.slug}
              plan={plan}
              currentPlan={currentPlan}
              selectedCycle={selectedCycle}
              onPlanSelect={handlePlanSelect}
              isLoading={updateBilling.isPending}
              variant="detailed"
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
