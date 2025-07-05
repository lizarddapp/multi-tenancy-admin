import React from "react";
import { Button } from "~/components/ui/button";
import {
  AlertCircle,
  FileX,
  RefreshCw,
  Search,
  Plus,
  Database,
  Wifi,
  ShieldAlert,
} from "lucide-react";

export interface EmptyStateProps {
  // State type
  variant?:
    | "empty"
    | "error"
    | "notFound"
    | "noResults"
    | "offline"
    | "unauthorized";

  // Content
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;

  // Actions
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary";
    icon?: React.ComponentType<{ className?: string }>;
  };

  // Styling
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Default configurations for different variants
const variantConfigs = {
  empty: {
    icon: FileX,
    title: "No data available",
    description: "There's nothing to show here yet.",
  },
  error: {
    icon: AlertCircle,
    title: "Something went wrong",
    description:
      "We encountered an error while loading the data. Please try again.",
  },
  notFound: {
    icon: Search,
    title: "Not found",
    description:
      "The resource you're looking for doesn't exist or has been moved.",
  },
  noResults: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
  offline: {
    icon: Wifi,
    title: "Connection lost",
    description: "Please check your internet connection and try again.",
  },
  unauthorized: {
    icon: ShieldAlert,
    title: "Access denied",
    description: "You don't have permission to view this resource.",
  },
};

// Size configurations
const sizeConfigs = {
  sm: {
    container: "py-8",
    icon: "h-8 w-8",
    title: "text-lg font-semibold",
    description: "text-sm",
  },
  md: {
    container: "py-12",
    icon: "h-12 w-12",
    title: "text-xl font-semibold",
    description: "text-base",
  },
  lg: {
    container: "py-16",
    icon: "h-16 w-16",
    title: "text-2xl font-bold",
    description: "text-lg",
  },
};

export function EmptyState({
  variant = "empty",
  title,
  description,
  icon,
  action,
  className = "",
  size = "md",
}: EmptyStateProps) {
  const config = variantConfigs[variant];
  const sizeConfig = sizeConfigs[size];

  const Icon = icon || config.icon;
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;

  const iconColor =
    variant === "error" || variant === "unauthorized"
      ? "text-destructive"
      : "text-muted-foreground";

  return (
    <div
      className={`flex flex-col items-center justify-center text-center ${sizeConfig.container} ${className}`}
    >
      <Icon className={`${sizeConfig.icon} ${iconColor} mb-4`} />

      <h3 className={`${sizeConfig.title} text-foreground mb-2`}>
        {finalTitle}
      </h3>

      <p
        className={`${sizeConfig.description} text-muted-foreground max-w-md mb-6`}
      >
        {finalDescription}
      </p>

      {action && (
        <Button
          onClick={action.onClick}
          variant={action.variant || "default"}
          className="flex items-center gap-2"
        >
          {action.icon && <action.icon className="h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Preset components for common use cases
export const EmptyStates = {
  // No data available
  Empty: (props: Omit<EmptyStateProps, "variant">) => (
    <EmptyState variant="empty" {...props} />
  ),

  // Error loading data
  Error: (props: Omit<EmptyStateProps, "variant">) => (
    <EmptyState variant="error" {...props} />
  ),

  // Resource not found
  NotFound: (props: Omit<EmptyStateProps, "variant">) => (
    <EmptyState variant="notFound" {...props} />
  ),

  // No search results
  NoResults: (props: Omit<EmptyStateProps, "variant">) => (
    <EmptyState variant="noResults" {...props} />
  ),

  // Offline/connection issues
  Offline: (props: Omit<EmptyStateProps, "variant">) => (
    <EmptyState variant="offline" {...props} />
  ),

  // Unauthorized access
  Unauthorized: (props: Omit<EmptyStateProps, "variant">) => (
    <EmptyState variant="unauthorized" {...props} />
  ),
};

// Helper function to create common actions
export const createEmptyStateAction = {
  retry: (onRetry: () => void) => ({
    label: "Try again",
    onClick: onRetry,
    variant: "outline" as const,
    icon: RefreshCw,
  }),

  create: (onCreate: () => void, resourceName: string = "item") => ({
    label: `Create ${resourceName}`,
    onClick: onCreate,
    variant: "default" as const,
    icon: Plus,
  }),

  goBack: (onGoBack: () => void) => ({
    label: "Go back",
    onClick: onGoBack,
    variant: "outline" as const,
  }),

  refresh: (onRefresh: () => void) => ({
    label: "Refresh",
    onClick: onRefresh,
    variant: "outline" as const,
    icon: RefreshCw,
  }),
};
