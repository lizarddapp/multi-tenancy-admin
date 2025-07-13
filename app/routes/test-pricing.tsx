import type { MetaFunction } from "react-router";
import { PricingPlansTest } from "~/components/test/pricing-plans-test";
import { PricingPlansSection } from "~/components/billing/pricing-plans-section";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useAuth } from "~/lib/hooks/useAuth";
import { BillingPlan, BillingCycle } from "~/types";

export const meta: MetaFunction = () => {
  return [
    { title: "Pricing Plans API Test" },
    { name: "description", content: "Test the pricing plans API integration" },
  ];
};

export default function TestPricingPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Authentication Status */}
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isAuthenticated ? "default" : "secondary"}>
              {isAuthenticated ? "Authenticated" : "Not Authenticated"}
            </Badge>
            {user && (
              <span className="text-sm text-muted-foreground">
                Logged in as: {user.email}
              </span>
            )}
          </div>
          {!isAuthenticated && (
            <p className="text-sm text-muted-foreground mt-2">
              To test the full billing page, please{" "}
              <a href="/auth/login" className="text-primary hover:underline">
                login first
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Pricing Plans Test (Public API) */}
      <PricingPlansTest />

      {/* Pricing Plans Section (Same as in Billing Page) */}
      {isAuthenticated && (
        <Card>
          <CardHeader>
            <CardTitle>Pricing Plans Section (From Billing Page)</CardTitle>
            <p className="text-sm text-muted-foreground">
              This is the same component used in the billing page
            </p>
          </CardHeader>
          <CardContent>
            <PricingPlansSection
              currentPlan={BillingPlan.FREE}
              currentCycle={BillingCycle.MONTHLY}
              onPlanSelect={(plan, cycle) => {
                console.log("Plan selected:", plan, cycle);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
