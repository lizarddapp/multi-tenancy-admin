import { useState } from "react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { CheckCircle } from "lucide-react";
import { useAuth } from "~/lib/hooks/useAuth";
import { useCurrentBilling } from "~/lib/hooks/useBilling";
import { useTenant } from "~/lib/hooks/useTenant";
import { BillingPlan, BillingCycle } from "~/types";
import { toast } from "sonner";
import { PaymentDialog } from "./payment-dialog";
import { PricingPlansSection } from "./pricing-plans-section";
import { usePricingPlansComparison } from "~/lib/hooks/usePricingPlans";

interface PricingPlansSelectorProps {
  /** Whether to show the current billing status alert */
  showCurrentStatus?: boolean;
  /** Whether to show login prompt for unauthenticated users */
  showLoginPrompt?: boolean;
  /** Callback when a plan is successfully selected/paid for */
  onPlanSuccess?: (plan: BillingPlan, cycle: BillingCycle) => void;
  /** Custom title for the section */
  title?: string;
  /** Custom description for the section */
  description?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
}

export function PricingPlansSelector({
  showCurrentStatus = true,
  showLoginPrompt = true,
  onPlanSuccess,
  title = "Choose Your Plan",
  description = "Select the perfect plan for your needs. Click on any plan to get started.",
  compact = false,
}: PricingPlansSelectorProps) {
  const { isAuthenticated } = useAuth();
  const { currentTenant } = useTenant();
  const { data: billingResponse } = useCurrentBilling();

  const [selectedPlan, setSelectedPlan] = useState<{
    plan: BillingPlan;
    cycle: BillingCycle;
  } | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(
    BillingCycle.MONTHLY
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const currentBilling = billingResponse?.data;

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

  // Helper function to get Stripe price ID for selected plan
  const getSelectedPlanPriceId = () => {
    if (!selectedPlan || !(plansResponse as any)?.data) return "";

    const planData = (plansResponse as any).data.find(
      (p: any) => p.slug === selectedPlan.plan
    );
    if (!planData) {
      console.warn(`Plan data not found for: ${selectedPlan.plan}`);
      return "";
    }

    const priceId =
      selectedPlan.cycle === "yearly"
        ? planData.stripePriceIdYearly
        : planData.stripePriceIdMonthly;

    if (!priceId) {
      console.warn(
        `Stripe price ID not found for plan: ${selectedPlan.plan}, cycle: ${selectedPlan.cycle}`
      );
    }

    return priceId || "";
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
      // The payment dialog handles the subscription creation
      // We just need to show success and call the callback
      toast.success(`Successfully subscribed to ${plan} plan!`);

      // Clear selection after successful payment
      setSelectedPlan(null);
      setShowPaymentDialog(false);

      // Call the success callback if provided
      onPlanSuccess?.(plan, cycle);
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
    <div className={`space-y-${compact ? '4' : '8'}`}>
      {/* Page Header */}
      {!compact && (
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      )}

      {/* Current Billing Status */}
      {showCurrentStatus && currentBilling && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Current Plan: <strong>{currentBilling.plan}</strong> (
            {currentBilling.cycle})
            {currentBilling.status && ` - Status: ${currentBilling.status}`}
          </AlertDescription>
        </Alert>
      )}

      {/* Login Prompt */}
      {showLoginPrompt && !isAuthenticated && (
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
          priceId={getSelectedPlanPriceId()}
          onPaymentSuccess={handlePaymentSuccess}
          isLoading={isProcessing}
        />
      )}
    </div>
  );
}
