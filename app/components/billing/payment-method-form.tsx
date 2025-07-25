import { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Loader2, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";
import { BillingPlan, BillingCycle } from "~/types";
import { stripeService } from "~/lib/api/services/stripe";
import { useAuth } from "~/lib/hooks/useAuth";
import { formatCurrency } from "~/lib/utils";

interface PaymentMethodFormProps {
  plan: BillingPlan;
  cycle: BillingCycle;
  price?: number; // Price in cents
  priceId: string; // Stripe price ID
  onPaymentSuccess: (plan: BillingPlan, cycle: BillingCycle) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PaymentMethodForm({
  plan,
  cycle,
  price,
  priceId,
  onPaymentSuccess,
  onCancel,
  isLoading = false,
}: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
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

    setIsProcessing(true);

    try {
      // Validate that we have a price ID
      if (!priceId) {
        setError("Price ID is missing. Please try again or contact support.");
        return;
      }

      // Create subscription with backend
      const { subscriptionId, clientSecret } =
        await stripeService.createSubscription({
          priceId,
          customerEmail: user?.email || "",
          customerName: cardholderName,
        });

      // Confirm subscription payment with Stripe
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: cardholderName,
              email: user?.email,
            },
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || "Payment failed. Please try again.");
        return;
      }

      // Call success callback
      onPaymentSuccess(plan, cycle);

      toast.success("Subscription created successfully!");

      // Log subscription ID for debugging
      console.log("Subscription created:", subscriptionId);

      // Reset form
      setCardholderName("");
      cardElement.clear();
    } catch (err) {
      console.error("Payment processing failed:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
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

  // Format the price (convert from cents to dollars)
  const formattedPrice = price ? (price / 100).toFixed(2) : "0.00";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Pricing Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{plan} Plan</h3>
                <p className="text-sm text-muted-foreground">
                  {cycle === "yearly" ? "Annual" : "Monthly"} subscription
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${formattedPrice}</div>
                <div className="text-sm text-muted-foreground">
                  per {cycle === "yearly" ? "year" : "month"}
                </div>
              </div>
            </div>

            {cycle === "yearly" && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Check className="h-4 w-4" />
                <span>Save money with annual billing</span>
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <p className="text-sm text-muted-foreground">
            Enter your payment information to complete the subscription
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="cardholderName">Cardholder Name</Label>
          <Input
            id="cardholderName"
            type="text"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            placeholder="John Doe"
            required
            disabled={isProcessing || isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label>Card Information</Label>
          <div className="border rounded-md p-3 bg-background">
            <CardElement
              options={cardElementOptions}
              onChange={(event) => {
                if (event.error) {
                  setError(event.error.message);
                } else {
                  setError(null);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing || isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || isLoading || !stripe}
          className="flex-1"
        >
          {isProcessing || isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Start Subscription
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
