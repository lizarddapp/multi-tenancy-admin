import type { MetaFunction } from "react-router";
import { PricingPlansSelector } from "~/components/billing/pricing-plans-selector";
import { BillingPlan, BillingCycle } from "~/types";
import { toast } from "sonner";

export const meta: MetaFunction = () => {
  return [
    { title: "Pricing Plans API Test" },
    { name: "description", content: "Test the pricing plans API integration" },
  ];
};

export default function TestPricingPage() {
  // Handle successful plan selection
  const handlePlanSuccess = (plan: BillingPlan, cycle: BillingCycle) => {
    toast.success(`Successfully subscribed to ${plan} plan (${cycle})!`);
  };

  return (
    <div className="container mx-auto py-6">
      <PricingPlansSelector
        showCurrentStatus={true}
        showLoginPrompt={true}
        onPlanSuccess={handlePlanSuccess}
        title="Pricing Plans API Test"
        description="Test the pricing plans API integration with Stripe subscriptions"
      />
    </div>
  );
}
