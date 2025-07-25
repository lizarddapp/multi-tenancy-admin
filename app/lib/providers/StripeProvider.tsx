import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { useState, useEffect, type ReactNode } from "react";
import { stripeService } from "~/lib/api/services/stripe";

// We'll load the publishable key from the API
let stripePromise: Promise<Stripe | null> | null = null;

const getStripe = (publishableKey: string) => {
  if (!stripePromise && publishableKey) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  const [publishableKey, setPublishableKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublishableKey = async () => {
      try {
        const { publishableKey } = await stripeService.getPublishableKey();
        setPublishableKey(publishableKey);
      } catch (error) {
        console.error("Failed to fetch Stripe publishable key:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishableKey();
  }, []);

  if (isLoading) {
    return <div>Loading Stripe...</div>;
  }

  if (!publishableKey) {
    return <div>Failed to load Stripe. Please refresh the page.</div>;
  }

  return (
    <Elements
      stripe={getStripe(publishableKey)}
      options={{
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#0570de",
            colorBackground: "#ffffff",
            colorText: "#30313d",
            colorDanger: "#df1b41",
            fontFamily: "Inter, system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "6px",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
}
