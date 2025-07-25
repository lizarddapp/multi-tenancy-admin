import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { BillingPlan, BillingCycle } from "~/types";
import { PaymentMethodForm } from "./payment-method-form";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: BillingPlan;
  cycle: BillingCycle;
  price?: number; // Price in cents
  priceId: string; // Stripe price ID
  onPaymentSuccess: (plan: BillingPlan, cycle: BillingCycle) => void;
  isLoading?: boolean;
}

export function PaymentDialog({
  open,
  onOpenChange,
  plan,
  cycle,
  price,
  priceId,
  onPaymentSuccess,
  isLoading = false,
}: PaymentDialogProps) {
  const handlePaymentSuccess = (
    selectedPlan: BillingPlan,
    selectedCycle: BillingCycle
  ) => {
    onPaymentSuccess(selectedPlan, selectedCycle);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-md">
        <ScrollArea className="flex max-h-full flex-col overflow-hidden">
          <DialogHeader className="contents space-y-0 text-left">
            <DialogTitle className="px-6 pt-6">
              Complete Your Subscription
            </DialogTitle>
            <DialogDescription className="px-6">
              Enter your payment details to subscribe to the {plan} plan.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            <PaymentMethodForm
              plan={plan}
              cycle={cycle}
              price={price}
              priceId={priceId}
              onPaymentSuccess={handlePaymentSuccess}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
