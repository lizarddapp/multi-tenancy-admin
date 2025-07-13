import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "sonner";
import type { Billing } from "~/types/dashboard";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billing: Billing;
}

export function AddPaymentMethodDialog({
  open,
  onOpenChange,
  billing,
}: AddPaymentMethodDialogProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe has not loaded yet. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found. Please refresh and try again.");
      return;
    }

    if (!cardholderName.trim()) {
      setError("Please enter the cardholder name.");
      return;
    }

    setIsLoading(true);

    try {
      // Create payment method
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred while processing your card.");
        return;
      }

      if (!paymentMethod) {
        setError("Failed to create payment method. Please try again.");
        return;
      }

      // Here you would typically send the payment method to your backend
      // to attach it to the customer
      console.log("Payment method created:", paymentMethod);

      // For now, we'll just show a success message
      toast.success("Payment method added successfully!");
      onOpenChange(false);
      
      // Reset form
      setCardholderName("");
      cardElement.clear();

    } catch (err) {
      console.error("Payment method creation failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: "Inter, system-ui, sans-serif",
      },
      invalid: {
        color: "#9e2146",
      },
    },
    hidePostalCode: false,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add Payment Method
          </DialogTitle>
          <DialogDescription>
            Add a new payment method to your account. Your card information is
            securely processed by Stripe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              type="text"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Card Information</Label>
            <div className="border rounded-md p-3 bg-background">
              <CardElement options={cardElementOptions} />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !stripe}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Add Payment Method
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
