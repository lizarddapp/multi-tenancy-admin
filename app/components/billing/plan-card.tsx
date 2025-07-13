import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Check, Users, HardDrive, Code, FolderOpen } from "lucide-react";
import { BillingCycle } from "~/types";
import type {
  PricingPlan,
  PlanFeature,
} from "~/lib/api/services/pricing-plans";
import { formatCurrency } from "~/lib/utils";
import {
  getPlanComparisonData,
  formatPlanLimit,
  getFormattedPlanFeatures,
} from "~/lib/utils/plan-utils";

interface PlanCardProps {
  plan: PricingPlan;
  currentPlan: string;
  selectedCycle: BillingCycle;
  onPlanSelect: (planSlug: string) => void;
  isLoading?: boolean;
  variant?: "default" | "compact" | "detailed";
  showTrialInfo?: boolean;
  className?: string;
}

export function PlanCard({
  plan,
  currentPlan,
  selectedCycle,
  onPlanSelect,
  isLoading = false,
  variant = "default",
  showTrialInfo = true,
  className = "",
}: PlanCardProps) {
  const {
    price,
    savings,
    isCurrent,
    canUpgrade,
    canDowngrade,
    actionType,
    Icon,
  } = getPlanComparisonData(plan, currentPlan as any, selectedCycle);

  const formattedFeatures = getFormattedPlanFeatures(plan);

  const getButtonText = () => {
    if (isLoading) return "Processing...";

    switch (actionType) {
      case "current":
        return "✓ Current Plan";
      case "upgrade":
        return `Upgrade to ${plan.name}`;
      case "downgrade":
        return `Downgrade to ${plan.name}`;
      default:
        return "Contact Sales";
    }
  };

  const getButtonVariant = () => {
    switch (actionType) {
      case "current":
        return "outline" as const;
      case "upgrade":
        return plan.isPopular ? ("default" as const) : ("secondary" as const);
      case "downgrade":
        return "outline" as const;
      default:
        return "outline" as const;
    }
  };

  const getButtonClassName = () => {
    const baseClasses = "w-full";

    switch (actionType) {
      case "current":
        return `${baseClasses} border-primary text-primary bg-primary/5`;
      case "upgrade":
        return plan.isPopular
          ? `${baseClasses} bg-primary hover:bg-primary/90`
          : `${baseClasses} bg-secondary hover:bg-secondary/80 text-secondary-foreground`;
      default:
        return baseClasses;
    }
  };

  const cardClassName = `relative transition-all duration-200 hover:shadow-lg ${
    plan.isPopular ? "border-primary shadow-md scale-105" : "border-border"
  } ${isCurrent ? "ring-2 ring-primary bg-primary/5" : ""} ${className}`;

  return (
    <Card className={cardClassName}>
      {plan.isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>

        <CardTitle className="text-xl font-semibold mb-2">
          {plan.name}
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground mb-4">
          {plan.description}
        </CardDescription>

        <div className="space-y-1">
          <div className="text-4xl font-bold text-foreground">
            {formatCurrency(price, plan.currency)}
          </div>
          <div className="text-sm text-muted-foreground">
            per {selectedCycle === BillingCycle.YEARLY ? "year" : "month"}
          </div>
          {savings > 0 && (
            <div className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
              Save {savings}%
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Plan Limits */}
        {variant !== "compact" && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="font-medium">Users</span>
                </div>
                <span className="text-muted-foreground">
                  {formatPlanLimit(plan.limits.maxUsers)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  <span className="font-medium">Storage</span>
                </div>
                <span className="text-muted-foreground">
                  {formatPlanLimit(plan.limits.maxStorage, "GB")}
                </span>
              </div>

              {plan.limits.maxApiCalls && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-primary" />
                    <span className="font-medium">API Calls</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatPlanLimit(plan.limits.maxApiCalls)}/mo
                  </span>
                </div>
              )}

              {plan.limits.maxProjects && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    <span className="font-medium">Projects</span>
                  </div>
                  <span className="text-muted-foreground">
                    {formatPlanLimit(plan.limits.maxProjects)}
                  </span>
                </div>
              )}
            </div>

            <Separator />
          </>
        )}

        {/* Key Features */}
        <div className="space-y-2">
          {variant === "detailed" && (
            <h4 className="text-sm font-medium text-foreground mb-3">
              What's included:
            </h4>
          )}

          {formattedFeatures
            .slice(
              0,
              variant === "compact" ? 3 : variant === "detailed" ? 8 : 6
            )
            .map(
              (
                feature: PlanFeature & { displayName: string },
                index: number
              ) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Check
                    className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                      feature.included ? "text-green-500" : "text-gray-300"
                    }`}
                  />
                  <span
                    className={
                      feature.included
                        ? "text-foreground"
                        : "text-muted-foreground line-through"
                    }
                    title={feature.description}
                  >
                    {feature.displayName}
                  </span>
                </div>
              )
            )}

          {plan.features.length >
            (variant === "compact" ? 3 : variant === "detailed" ? 8 : 6) && (
            <div className="text-xs text-muted-foreground pt-1">
              +
              {plan.features.length -
                (variant === "compact"
                  ? 3
                  : variant === "detailed"
                  ? 8
                  : 6)}{" "}
              more features
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button
            variant={getButtonVariant()}
            className={getButtonClassName()}
            onClick={() => onPlanSelect(plan.slug)}
            disabled={
              isLoading || actionType === "current" || actionType === "contact"
            }
          >
            {getButtonText()}
          </Button>

          {showTrialInfo && plan.trialDays > 0 && !isCurrent && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {plan.trialDays}-day free trial
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
