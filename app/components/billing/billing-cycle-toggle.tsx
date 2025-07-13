import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import { BillingCycle } from "~/types/dashboard";

interface BillingCycleToggleProps {
  selectedCycle: BillingCycle;
  onCycleChange: (cycle: BillingCycle) => void;
  showSavings?: boolean;
  savingsText?: string;
  className?: string;
  size?: "default" | "sm" | "lg";
}

export function BillingCycleToggle({
  selectedCycle,
  onCycleChange,
  showSavings = true,
  savingsText = "Save up to 17%",
  className = "",
  size = "default",
}: BillingCycleToggleProps) {
  const sizeClasses = {
    sm: "space-x-2 text-sm",
    default: "space-x-4",
    lg: "space-x-6 text-lg",
  };

  const paddingClasses = {
    sm: "pt-2",
    default: "pt-4",
    lg: "pt-6",
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${paddingClasses[size]} ${className}`}>
      <Label 
        htmlFor="cycle-toggle" 
        className={`cursor-pointer transition-colors ${
          selectedCycle === BillingCycle.MONTHLY 
            ? "font-semibold text-foreground" 
            : "text-muted-foreground"
        }`}
      >
        Monthly
      </Label>
      
      <Switch
        id="cycle-toggle"
        checked={selectedCycle === BillingCycle.YEARLY}
        onCheckedChange={(checked) =>
          onCycleChange(checked ? BillingCycle.YEARLY : BillingCycle.MONTHLY)
        }
        className="data-[state=checked]:bg-primary"
      />
      
      <Label 
        htmlFor="cycle-toggle" 
        className={`cursor-pointer transition-colors ${
          selectedCycle === BillingCycle.YEARLY 
            ? "font-semibold text-foreground" 
            : "text-muted-foreground"
        }`}
      >
        Yearly
        {showSavings && (
          <Badge 
            variant="secondary" 
            className={`ml-2 bg-green-100 text-green-700 border-green-200 ${
              size === "sm" ? "text-xs px-1.5 py-0.5" : ""
            }`}
          >
            {savingsText}
          </Badge>
        )}
      </Label>
    </div>
  );
}
