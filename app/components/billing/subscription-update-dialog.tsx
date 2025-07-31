import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Loader2, CreditCard, TrendingUp, TrendingDown } from "lucide-react";
import { BillingPlan, BillingCycle } from "~/types";
import { stripeService } from "~/lib/api/services/stripe";
import { toast } from "sonner";

interface SubscriptionUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPlan: BillingPlan;
  currentCycle: BillingCycle;
  targetPlan: BillingPlan;
  targetCycle: BillingCycle;
  targetPriceId: string;
  onUpdateSuccess: () => void;
}

export function SubscriptionUpdateDialog({
  open,
  onOpenChange,
  currentPlan,
  currentCycle,
  targetPlan,
  targetCycle,
  targetPriceId,
  onUpdateSuccess,
}: SubscriptionUpdateDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const isUpgrade = getPlanLevel(targetPlan) > getPlanLevel(currentPlan);
  const isCycleChange = currentCycle !== targetCycle;
  
  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    
    try {
      await stripeService.updateSubscription({ priceId: targetPriceId });
      
      toast.success(
        `Successfully ${isUpgrade ? 'upgraded' : 'changed'} to ${targetPlan} plan!`
      );
      
      onUpdateSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Subscription update failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update subscription. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const getActionText = () => {
    if (isUpgrade && isCycleChange) {
      return `Upgrade to ${targetPlan} (${targetCycle})`;
    } else if (isUpgrade) {
      return `Upgrade to ${targetPlan}`;
    } else if (isCycleChange) {
      return `Switch to ${targetPlan} (${targetCycle})`;
    } else {
      return `Change to ${targetPlan}`;
    }
  };

  const getProrationDescription = () => {
    if (isUpgrade) {
      return "You'll be charged a prorated amount for the upgrade, and receive credit for any unused time on your current plan.";
    } else {
      return "You'll receive credit for any unused time on your current plan, and the difference will be applied to your next invoice.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isUpgrade ? (
              <TrendingUp className="h-5 w-5 text-green-600" />
            ) : (
              <TrendingDown className="h-5 w-5 text-blue-600" />
            )}
            {getActionText()}
          </DialogTitle>
          <DialogDescription>
            Confirm your subscription change. This will take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current vs Target Plan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Current Plan</h4>
              <div className="p-3 border rounded-lg">
                <div className="font-medium">{currentPlan}</div>
                <Badge variant="outline" className="mt-1">
                  {currentCycle}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">New Plan</h4>
              <div className="p-3 border rounded-lg bg-primary/5">
                <div className="font-medium">{targetPlan}</div>
                <Badge variant="default" className="mt-1">
                  {targetCycle}
                </Badge>
              </div>
            </div>
          </div>

          {/* Proration Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CreditCard className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="space-y-2">
                <h4 className="font-medium text-blue-900">Automatic Proration</h4>
                <p className="text-sm text-blue-700">
                  {getProrationDescription()}
                </p>
                <p className="text-xs text-blue-600">
                  The exact amount will be calculated by Stripe based on your current billing cycle.
                </p>
              </div>
            </div>
          </div>

          {/* Features Info */}
          {isUpgrade && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">What you'll get:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Immediate access to {targetPlan} features</li>
                <li>• Higher usage limits</li>
                <li>• Priority support</li>
                {targetPlan === BillingPlan.PRO && <li>• Advanced analytics</li>}
                {targetPlan === BillingPlan.ENTERPRISE && <li>• Custom integrations</li>}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmUpdate}
            disabled={isUpdating}
            className={isUpgrade ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdating ? "Updating..." : `Confirm ${isUpgrade ? 'Upgrade' : 'Change'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to determine plan level for comparison
function getPlanLevel(plan: BillingPlan): number {
  switch (plan) {
    case BillingPlan.FREE:
      return 0;
    case BillingPlan.BASIC:
      return 1;
    case BillingPlan.PRO:
      return 2;
    case BillingPlan.ENTERPRISE:
      return 3;
    default:
      return 0;
  }
}
