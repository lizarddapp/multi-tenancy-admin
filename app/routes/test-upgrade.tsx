import type { MetaFunction } from "react-router";
import { UpgradeBanner } from "~/components/upgrade-banner";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useCurrentBilling } from "~/lib/hooks/useBilling";
import { useTenant } from "~/lib/hooks/useTenant";

export const meta: MetaFunction = () => {
  return [
    { title: "Upgrade Banner Test" },
    { name: "description", content: "Test the upgrade banner component" },
  ];
};

export default function TestUpgradePage() {
  const { currentTenant } = useTenant();
  const { data: billingData, isLoading: billingLoading } = useCurrentBilling();

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upgrade Banner Test</h1>
        <p className="text-muted-foreground">
          Test the upgrade banner component with different billing states
        </p>
      </div>

      {/* Current Tenant Info */}
      <Card>
        <CardHeader>
          <CardTitle>Current Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          {currentTenant ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentTenant.slug}</Badge>
                <span className="text-sm">{currentTenant.name}</span>
                <Badge variant={currentTenant.status === 'active' ? 'default' : 'secondary'}>
                  {currentTenant.status}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tenant selected</p>
          )}
        </CardContent>
      </Card>

      {/* Billing Info */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
        </CardHeader>
        <CardContent>
          {billingLoading ? (
            <p className="text-sm text-muted-foreground">Loading billing data...</p>
          ) : billingData?.data?.data ? (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Plan:</span> 
                  <Badge variant="outline" className="ml-2">
                    {billingData.data.data.plan}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <Badge 
                    variant={billingData.data.data.status === 'active' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {billingData.data.data.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Cycle:</span> 
                  <span className="ml-2">{billingData.data.data.cycle}</span>
                </div>
                <div>
                  <span className="font-medium">Amount:</span> 
                  <span className="ml-2">
                    ${(billingData.data.data.amount / 100).toFixed(2)} {billingData.data.data.currency}
                  </span>
                </div>
              </div>
              {billingData.data.data.trialEnd && (
                <div className="text-sm">
                  <span className="font-medium">Trial End:</span> 
                  <span className="ml-2">{new Date(billingData.data.data.trialEnd).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No billing data found</p>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Banner Test */}
      <Card>
        <CardHeader>
          <CardTitle>Upgrade Banner</CardTitle>
        </CardHeader>
        <CardContent>
          <UpgradeBanner />
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>The upgrade banner should appear in the sidebar when:</p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>No billing record exists (shows "Set Up Billing")</li>
            <li>Plan is "free" (shows "Upgrade to Pro")</li>
            <li>Status is "past_due" (shows "Payment Required")</li>
            <li>Status is "cancelled" (shows "Reactivate Subscription")</li>
            <li>Trial has expired (shows "Trial Expired")</li>
          </ul>
          <p className="mt-4">
            The banner should NOT appear when the subscription is active and not on the free plan.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
