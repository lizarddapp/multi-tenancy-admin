import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { BillingPlan, BillingCycle } from "~/types";
import { PricingPlansSelector } from "./pricing-plans-selector";
import { StripeProvider } from "~/lib/providers/StripeProvider";
import { toast } from "sonner";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan?: BillingPlan;
  currentCycle?: BillingCycle;
  /** Callback when a plan is successfully upgraded */
  onUpgradeSuccess?: (plan: BillingPlan, cycle: BillingCycle) => void;
}

export function UpgradePlanDialog({
  open,
  onOpenChange,
  currentPlan,
  currentCycle,
  onUpgradeSuccess,
}: UpgradePlanDialogProps) {
  // Handle successful plan upgrade
  const handlePlanSuccess = (plan: BillingPlan, cycle: BillingCycle) => {
    toast.success(`Successfully upgraded to ${plan} plan!`);
    onUpgradeSuccess?.(plan, cycle);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <StripeProvider>
          <PricingPlansSelector
            showCurrentStatus={false}
            showLoginPrompt={false}
            onPlanSuccess={handlePlanSuccess}
            title=""
            description=""
            compact={true}
          />
        </StripeProvider>
      </DialogContent>
    </Dialog>
  );
}
