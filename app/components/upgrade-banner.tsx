import { Crown, Zap, ArrowRight } from "lucide-react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { TenantLink } from "./tenant-link";
import { useCurrentBilling } from "~/lib/hooks/useBilling";
import { BillingPlan, BillingStatus } from "~/types";

interface UpgradeBannerProps {
  className?: string;
}

export function UpgradeBanner({ className }: UpgradeBannerProps) {
  const { data: billingData, isLoading: billingLoading } = useCurrentBilling();
  const billing = billingData?.data?.data;

  // Don't show banner if loading
  if (billingLoading) {
    return null;
  }

  // If no billing data, show setup message
  if (!billing) {
    return (
      <Card
        className={`border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 ${className}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                <Crown className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Set Up Billing
                </h3>
                <Badge variant="outline" className="text-xs">
                  Required
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mb-3">
                Set up your billing to start using advanced features.
              </p>
              <div className="flex space-x-2">
                <TenantLink to="/test-pricing">
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Choose Plan
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </TenantLink>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If billing exists but doesn't need upgrade, don't show banner
  if (!billing.needsUpgrade) {
    return null;
  }

  // Determine banner content based on billing status
  const getBannerContent = () => {
    if (billing.plan === BillingPlan.FREE) {
      return {
        title: "Upgrade to Pro",
        description:
          "Unlock advanced features and remove limits with our Pro plan.",
        badge: "Free Plan",
        badgeVariant: "secondary" as const,
        bgGradient: "from-amber-50 to-orange-50",
        borderColor: "border-amber-200",
      };
    }

    if (billing.status === BillingStatus.PAST_DUE) {
      return {
        title: "Payment Required",
        description:
          "Your subscription is past due. Please update your payment method.",
        badge: "Past Due",
        badgeVariant: "destructive" as const,
        bgGradient: "from-red-50 to-pink-50",
        borderColor: "border-red-200",
      };
    }

    if (billing.status === BillingStatus.CANCELLED) {
      return {
        title: "Reactivate Subscription",
        description:
          "Your subscription was cancelled. Reactivate to continue using Pro features.",
        badge: "Cancelled",
        badgeVariant: "destructive" as const,
        bgGradient: "from-gray-50 to-slate-50",
        borderColor: "border-gray-200",
      };
    }

    if (billing.trialEnd && new Date(billing.trialEnd) < new Date()) {
      return {
        title: "Trial Expired",
        description:
          "Your free trial has ended. Upgrade now to continue using Pro features.",
        badge: "Trial Ended",
        badgeVariant: "destructive" as const,
        bgGradient: "from-red-50 to-pink-50",
        borderColor: "border-red-200",
      };
    }

    // Default upgrade message
    return {
      title: "Upgrade to Pro",
      description:
        "Unlock advanced features and remove limits with our Pro plan.",
      badge: "Upgrade Available",
      badgeVariant: "secondary" as const,
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
    };
  };

  const content = getBannerContent();
  return (
    <Card
      className={`${content.borderColor} bg-gradient-to-r ${content.bgGradient} ${className}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <Crown className="h-4 w-4 text-amber-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-sm font-medium text-gray-900">
                {content.title}
              </h3>
              <Badge variant={content.badgeVariant} className="text-xs">
                {content.badge}
              </Badge>
            </div>
            <p className="text-xs text-gray-600 mb-3">{content.description}</p>
            <div className="flex space-x-2">
              <TenantLink to="/test-pricing">
                <Button
                  size="sm"
                  className="h-7 text-xs bg-amber-600 hover:bg-amber-700"
                >
                  <Zap className="h-3 w-3 mr-1" />
                  View Plans
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </TenantLink>
              <TenantLink to="/billing">
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  Current Usage
                </Button>
              </TenantLink>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
