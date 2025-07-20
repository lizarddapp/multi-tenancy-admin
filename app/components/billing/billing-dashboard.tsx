import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { useCurrentBilling } from "~/lib/hooks/useBilling";
import { BillingStatus, BillingPlan, BillingCycle } from "~/types";
import { formatCurrency, formatDate } from "~/lib/utils";
import {
  CreditCard,
  Calendar,
  Users,
  HardDrive,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { UpgradePlanDialog } from "./upgrade-plan-dialog";
import { PaymentMethodCard } from "./payment-method-card";
import { PricingPlansSection } from "./pricing-plans-section";
import { useState } from "react";

// Helper function to safely parse billing features
const parseBillingFeatures = (
  features: string | string[] | undefined
): string[] => {
  if (!features) return [];

  if (Array.isArray(features)) {
    return features;
  }

  if (typeof features === "string") {
    try {
      const parsed = JSON.parse(features);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
};

export function BillingDashboard() {
  const { data: billingResponse, isLoading, error } = useCurrentBilling();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Handle no billing setup (null data) differently from other errors
  if (!error && billingResponse?.data && !billingResponse.data.data) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Set up your billing to start using advanced features
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Billing Setup</h3>
              <p className="text-muted-foreground mb-6">
                You haven't set up billing yet. Choose a plan to get started
                with advanced features.
              </p>
              <Button onClick={() => setShowUpgradeDialog(true)}>
                Choose a Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <PricingPlansSection
          currentPlan={BillingPlan.FREE}
          currentCycle={BillingCycle.MONTHLY}
          onPlanSelect={(_plan, _cycle) => {
            setShowUpgradeDialog(true);
          }}
        />

        <UpgradePlanDialog
          open={showUpgradeDialog}
          onOpenChange={setShowUpgradeDialog}
          currentPlan={BillingPlan.FREE}
          currentCycle={BillingCycle.MONTHLY}
        />
      </div>
    );
  }

  // Handle actual errors (not null data)
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load billing information</p>
            <p className="text-sm mt-2">Please try refreshing the page</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const billing = billingResponse?.data?.data;

  // If no billing data after successful response, this shouldn't happen
  // but we'll handle it gracefully
  if (!billing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>No billing data available</p>
            <p className="text-sm mt-2">
              Please contact support if this persists
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: BillingStatus) => {
    switch (status) {
      case BillingStatus.ACTIVE:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case BillingStatus.SUSPENDED:
      case BillingStatus.PAST_DUE:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case BillingStatus.CANCELLED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: BillingStatus) => {
    switch (status) {
      case BillingStatus.ACTIVE:
        return "bg-green-100 text-green-800";
      case BillingStatus.SUSPENDED:
      case BillingStatus.PAST_DUE:
        return "bg-yellow-100 text-yellow-800";
      case BillingStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan: BillingPlan) => {
    switch (plan) {
      case BillingPlan.FREE:
        return "bg-gray-100 text-gray-800";
      case BillingPlan.BASIC:
        return "bg-blue-100 text-blue-800";
      case BillingPlan.PRO:
        return "bg-purple-100 text-purple-800";
      case BillingPlan.ENTERPRISE:
        return "bg-gold-100 text-gold-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isTrialing =
    billing.trialEnd && new Date(billing.trialEnd) > new Date();
  const trialDaysLeft = isTrialing
    ? Math.ceil(
        (new Date(billing.trialEnd!).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your subscription, billing, and usage
          </p>
        </div>
        <Button onClick={() => setShowUpgradeDialog(true)}>
          <Star className="h-4 w-4 mr-2" />
          Upgrade Plan
        </Button>
      </div>

      {/* Trial Banner */}
      {isTrialing && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  Trial Period Active
                </p>
                <p className="text-sm text-yellow-700">
                  Your trial expires in {trialDaysLeft} days. Upgrade to
                  continue using all features.
                </p>
              </div>
              <Button
                size="sm"
                className="ml-auto"
                onClick={() => setShowUpgradeDialog(true)}
              >
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPlanColor(billing.plan)}>
                {billing.plan.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(billing.status)}>
                {getStatusIcon(billing.status)}
                {billing.status.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(billing.amount, billing.currency)}
              <span className="text-sm font-normal text-muted-foreground">
                /{billing.cycle}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Next Billing Date
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billing.currentPeriodEnd
                ? formatDate(billing.currentPeriodEnd)
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {billing.cancelAtPeriodEnd
                ? "Subscription will cancel"
                : "Auto-renewal"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Payment Method
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {billing.stripeCustomerId ? "•••• 4242" : "None"}
            </div>
            <p className="text-xs text-muted-foreground">
              {billing.stripeCustomerId
                ? "Visa ending in 4242"
                : "No payment method"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage and Limits */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              5 {billing.maxUsers ? `/ ${billing.maxUsers}` : "/ Unlimited"}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: billing.maxUsers
                    ? `${Math.min((5 / billing.maxUsers) * 100, 100)}%`
                    : "10%",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {billing.maxUsers
                ? `${billing.maxUsers - 5} users remaining`
                : "Unlimited users"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              2.5{" "}
              {billing.maxStorage ? `/ ${billing.maxStorage}` : "/ Unlimited"}{" "}
              GB
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: billing.maxStorage
                    ? `${Math.min((2.5 / billing.maxStorage) * 100, 100)}%`
                    : "10%",
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {billing.maxStorage
                ? `${billing.maxStorage - 2.5} GB remaining`
                : "Unlimited storage"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Method Management */}
      <PaymentMethodCard billing={billing} />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Features</CardTitle>
          <CardDescription>
            Features included in your current plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {parseBillingFeatures(billing.features).map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm capitalize">
                  {feature.replace(/_/g, " ")}
                </span>
              </div>
            ))}
            {parseBillingFeatures(billing.features).length === 0 && (
              <div className="col-span-2 text-center text-muted-foreground">
                No features configured for this plan
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Pricing Plans */}
      <PricingPlansSection
        currentPlan={billing.plan}
        currentCycle={billing.cycle}
        onPlanSelect={(_plan, _cycle) => {
          // Close any existing dialog and show upgrade dialog with selected plan
          setShowUpgradeDialog(true);
        }}
      />

      {/* Upgrade Dialog */}
      <UpgradePlanDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        currentPlan={billing.plan}
        currentCycle={billing.cycle}
      />
    </div>
  );
}
