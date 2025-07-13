import { usePricingPlansComparison } from "~/lib/hooks/usePricingPlans";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertTriangle, Check } from "lucide-react";

export function PricingPlansTest() {
  const { data: plansResponse, isLoading, error } = usePricingPlansComparison();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Pricing Plans...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !plansResponse?.data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Failed to load pricing plans: {error?.message || "Unknown error"}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const plans = plansResponse.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Plans API Test</CardTitle>
        <p className="text-sm text-muted-foreground">
          Successfully loaded {plans.length} pricing plans from the API
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <Card key={plan.slug} className="relative">
              {plan.isPopular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                
                <div className="mt-2">
                  <div className="text-2xl font-bold">
                    ${(plan.monthlyPrice / 100).toFixed(0)}
                  </div>
                  <div className="text-xs text-muted-foreground">per month</div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-2">
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Users:</strong> {plan.limits.maxUsers || "Unlimited"}
                  </div>
                  <div>
                    <strong>Storage:</strong> {plan.limits.maxStorage ? `${plan.limits.maxStorage}GB` : "Unlimited"}
                  </div>
                  {plan.limits.maxApiCalls && (
                    <div>
                      <strong>API:</strong> {plan.limits.maxApiCalls.toLocaleString()}/mo
                    </div>
                  )}
                </div>
                
                <div className="mt-3 space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <Check className={`h-3 w-3 ${feature.included ? "text-green-500" : "text-gray-300"}`} />
                      <span className={feature.included ? "" : "text-muted-foreground"}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{plan.features.length - 3} more
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">API Response Details:</h4>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(plansResponse, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
