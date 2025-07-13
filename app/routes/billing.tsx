import type { MetaFunction } from "react-router";
import { BillingDashboard } from "~/components/billing/billing-dashboard";
import { StripeProvider } from "~/lib/providers/StripeProvider";

export const meta: MetaFunction = () => {
  return [
    { title: "Billing & Subscription - Multi-Tenant Admin" },
    { name: "description", content: "Manage your billing and subscription" },
  ];
};

export default function BillingPage() {
  return (
    <StripeProvider>
      <div className="container mx-auto py-6">
        <BillingDashboard />
      </div>
    </StripeProvider>
  );
}
