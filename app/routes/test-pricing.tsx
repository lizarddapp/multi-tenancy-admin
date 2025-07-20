import type { MetaFunction } from "react-router";
import { useState } from "react";
import { PricingPlansSection } from "~/components/billing/pricing-plans-section";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useAuth } from "~/lib/hooks/useAuth";
import {
  useCurrentBilling,
  useCreateBilling,
  useUpdateBilling,
} from "~/lib/hooks/useBilling";
import { useTenant } from "~/lib/hooks/useTenant";
import { BillingPlan, BillingCycle } from "~/types";
import { toast } from "sonner";
import { StripeProvider } from "~/lib/providers/StripeProvider";
import { PaymentDialog } from "~/components/billing/payment-dialog";
import { usePricingPlansComparison } from "~/lib/hooks/usePricingPlans";

export const meta: MetaFunction = () => {
  return [
    { title: "Pricing Plans API Test" },
    { name: "description", content: "Test the pricing plans API integration" },
  ];
};

export default function TestPricingPage() {
  const { isAuthenticated } = useAuth();
  const { currentTenant } = useTenant();
  const { data: billingResponse } = useCurrentBilling();
  const createBilling = useCreateBilling();
  const updateBilling = useUpdateBilling();

  const [selectedPlan, setSelectedPlan] = useState<{
    plan: BillingPlan;
    cycle: BillingCycle;
  } | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(
    BillingCycle.MONTHLY
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const currentBilling = billingResponse?.data?.data;

  // Get pricing plans data for price calculation
  const { data: plansResponse } = usePricingPlansComparison();

  // Helper function to get price for selected plan
  const getSelectedPlanPrice = () => {
    if (!selectedPlan || !(plansResponse as any)?.data) return undefined;

    const planData = (plansResponse as any).data.find(
      (p: any) => p.slug === selectedPlan.plan
    );
    if (!planData) return undefined;

    return selectedPlan.cycle === "yearly"
      ? planData.yearlyPrice
      : planData.monthlyPrice;
  };

  // Handle plan selection from pricing cards - directly open payment dialog
  const handlePlanSelect = (plan: BillingPlan, cycle: BillingCycle) => {
    if (!isAuthenticated) {
      toast.error("Please login first to subscribe to a plan");
      return;
    }

    setSelectedPlan({ plan, cycle });
    setSelectedCycle(cycle);
    setShowPaymentDialog(true);
  };

  // Handle successful payment processing
  const handlePaymentSuccess = async (
    plan: BillingPlan,
    cycle: BillingCycle
  ) => {
    if (!isAuthenticated || !currentTenant) {
      toast.error("Please login and select a tenant first");
      return;
    }

    setIsProcessing(true);

    try {
      if (currentBilling) {
        // Update existing billing
        await updateBilling.mutateAsync({
          id: currentBilling.id,
          data: { plan, cycle },
        });
        toast.success(`Successfully upgraded to ${plan} plan!`);
      } else {
        // Create new billing record
        await createBilling.mutateAsync({
          tenantId: currentTenant.id,
          plan,
          cycle,
        });
        toast.success(`Successfully subscribed to ${plan} plan!`);
      }

      // Clear selection after successful payment
      setSelectedPlan(null);
    } catch (error: any) {
      console.error("Plan selection failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to process plan selection"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StripeProvider>
      <div className="container mx-auto py-6 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Choose Your Plan</h1>
          <p className="text-muted-foreground">
            Select the perfect plan for your needs. Click on any plan to get
            started.
          </p>
        </div>

        {/* Current Billing Status */}
        {currentBilling && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Current Plan: <strong>{currentBilling.plan}</strong> (
              {currentBilling.cycle})
              {currentBilling.status && ` - Status: ${currentBilling.status}`}
            </AlertDescription>
          </Alert>
        )}

        {!isAuthenticated && (
          <Alert>
            <AlertDescription>
              Please{" "}
              <a href="/_auth/login" className="text-primary hover:underline">
                login
              </a>{" "}
              to subscribe to a plan
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing Plans Selection */}
        <PricingPlansSection
          currentPlan={
            selectedPlan?.plan || currentBilling?.plan || BillingPlan.FREE
          }
          currentCycle={selectedCycle}
          onPlanSelect={handlePlanSelect}
        />

        {/* Payment Dialog */}
        {selectedPlan && (
          <PaymentDialog
            open={showPaymentDialog}
            onOpenChange={setShowPaymentDialog}
            plan={selectedPlan.plan}
            cycle={selectedPlan.cycle}
            price={getSelectedPlanPrice()}
            onPaymentSuccess={handlePaymentSuccess}
            isLoading={isProcessing}
          />
        )}
      </div>
    </StripeProvider>
  );
}
