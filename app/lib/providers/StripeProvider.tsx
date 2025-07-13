import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ReactNode } from "react";

// Initialize Stripe with your publishable key
// In React Router v7, environment variables should be accessed differently
const getStripePublishableKey = () => {
  // For development, you can hardcode the test key
  // In production, this should come from your build process or server
  return "pk_test_51234567890abcdef"; // Replace with your actual publishable key
};

const stripePromise = loadStripe(getStripePublishableKey());

interface StripeProviderProps {
  children: ReactNode;
}

export function StripeProvider({ children }: StripeProviderProps) {
  return (
    <Elements
      stripe={stripePromise}
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
