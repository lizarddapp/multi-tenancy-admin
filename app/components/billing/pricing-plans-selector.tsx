import { useState } from "react";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useAuth } from "~/lib/hooks/useAuth";
import { useCurrentBilling } from "~/lib/hooks/useBilling";
import { BillingPlan, BillingCycle } from "~/types";
import { toast } from "sonner";
import { stripeService } from "~/lib/api/services/stripe";
import { PricingPlansSection } from "./pricing-plans-section";
import { SubscriptionUpdateDialog } from "./subscription-update-dialog";
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
  const { data: billingResponse } = useCurrentBilling();

  const [selectedPlan, setSelectedPlan] = useState<{
    plan: BillingPlan;
    cycle: BillingCycle;
    priceId: string;
  } | null>(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const currentBilling = billingResponse?.data;

  // Get pricing plans data for price calculation
  const { data: plansResponse } = usePricingPlansComparison();

  // Helper function to get Stripe price ID for a plan
  const getPlanPriceId = (plan: BillingPlan, cycle: BillingCycle) => {
    if (!(plansResponse as any)?.data) return "";

    const planData = (plansResponse as any).data.find(
      (p: any) => p.slug === plan
    );
    if (!planData) {
      console.warn(`Plan data not found for: ${plan}`);
      return "";
    }

    const priceId =
      cycle === BillingCycle.YEARLY
        ? planData.stripePriceIdYearly
        : planData.stripePriceIdMonthly;

    if (!priceId) {
      console.warn(
        `Stripe price ID not found for plan: ${plan}, cycle: ${cycle}`
      );
    }

    return priceId || "";
  };

  // Handle plan selection from pricing cards
  const handlePlanSelect = async (plan: BillingPlan, cycle: BillingCycle) => {
    if (!isAuthenticated) {
      toast.error("Please login first to subscribe to a plan");
      return;
    }

    try {
      const priceId = getPlanPriceId(plan, cycle);
      if (!priceId) {
        toast.error("Price ID not found for selected plan");
        return;
      }

      // Check if user has an existing subscription
      const hasActiveSubscription =
        currentBilling?.stripeSubscriptionId &&
        currentBilling?.status === "active";

      if (hasActiveSubscription) {
        // Show confirmation dialog for existing subscription update
        setSelectedPlan({ plan, cycle, priceId });
        setShowUpdateDialog(true);
      } else {
        // Create new subscription via Stripe Checkout
        const checkoutSession = await stripeService.createCheckoutSession({
          priceId,
          successUrl: `${window.location.origin}${window.location.pathname}?success=true`,
          cancelUrl: `${window.location.origin}${window.location.pathname}?canceled=true`,
        });

        // Redirect to Stripe Checkout
        window.location.href = checkoutSession.url;
      }
    } catch (error: any) {
      console.error("Plan selection failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to process plan selection"
      );
    }
  };

  // Handle successful subscription update
  const handleUpdateSuccess = () => {
    setSelectedPlan(null);
    setShowUpdateDialog(false);

    // Refresh billing data to show updated plan
    window.location.reload();
  };

  return (
    <div className={`space-y-${compact ? "4" : "8"}`}>
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
        currentPlan={currentBilling?.plan || BillingPlan.FREE}
        currentCycle={currentBilling?.cycle || BillingCycle.MONTHLY}
        onPlanSelect={handlePlanSelect}
      />

      {/* Note: New subscriptions handled via Stripe Checkout, upgrades via confirmation dialog */}

      {/* Subscription Update Confirmation Dialog */}
      {selectedPlan && currentBilling && (
        <SubscriptionUpdateDialog
          open={showUpdateDialog}
          onOpenChange={setShowUpdateDialog}
          currentPlan={currentBilling.plan || BillingPlan.FREE}
          currentCycle={currentBilling.cycle || BillingCycle.MONTHLY}
          targetPlan={selectedPlan.plan}
          targetCycle={selectedPlan.cycle}
          targetPriceId={selectedPlan.priceId}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
