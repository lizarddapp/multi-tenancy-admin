import type { MetaFunction } from "react-router";
import { BillingDashboard } from "~/components/billing/billing-dashboard";
import { StripeProvider } from "~/lib/providers/StripeProvider";
import { useCurrentBilling } from "~/lib/hooks/useBilling";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Billing & Subscription - Multi-Tenant Admin" },
    { name: "description", content: "Manage your billing and subscription" },
  ];
};

export default function BillingPage() {
  const { data: billingResponse, isLoading, error } = useCurrentBilling();

  // Debug logging to see what data we're getting
  useEffect(() => {
    console.log("Billing Page Debug:", {
      isLoading,
      error,
      billingResponse,
      billingData: billingResponse?.data?.data,
    });
  }, [billingResponse, isLoading, error]);

  return (
    <StripeProvider>
      <div className="container mx-auto py-6">
        <BillingDashboard />
      </div>
    </StripeProvider>
  );
}
