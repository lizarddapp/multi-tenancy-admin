import React from "react";
import { Button } from "~/components/ui/button";
import { TenantLink } from "~/components/tenant-link";
import { ArrowLeft } from "lucide-react";
import { cn } from "~/lib/utils";
import { useNavigate, useNavigation } from "react-router";

export interface PageHeaderProps {
  /**
   * The main title of the page
   */
  title: string;

  /**
   * Optional description/subtitle for the page
   */
  description?: string;

  /**
   * Back navigation configuration
   */
  backTo?: {
    /** Path to navigate back to */
    path: string;
    /** Label for the back button (optional, defaults to "Back") */
    label?: string;
    /** Whether this is a global route (no tenant prefix) */
    global?: boolean;
  };

  /**
   * Additional actions to display on the right side
   */
  actions?: React.ReactNode;

  /**
   * Additional CSS classes for the container
   */
  className?: string;

  /**
   * Additional CSS classes for the title
   */
  titleClassName?: string;

  /**
   * Additional CSS classes for the description
   */
  descriptionClassName?: string;
}

/**
 * Reusable page header component with optional back navigation and actions
 *
 * @example
 * // Basic usage
 * <PageHeader
 *   title="My Profile"
 *   description="Manage your personal information and security settings"
 *   backTo={{ path: "/dashboard", label: "Back to Dashboard" }}
 * />
 *
 * @example
 * // With actions
 * <PageHeader
 *   title="Users"
 *   description="Manage user accounts and permissions"
 *   actions={
 *     <Button>
 *       <Plus className="h-4 w-4 mr-2" />
 *       Add User
 *     </Button>
 *   }
 * />
 *
 * @example
 * // Without back navigation
 * <PageHeader
 *   title="Dashboard"
 *   description="Overview of your tenant's activity"
 * />
 */
export function PageHeader({
  title,
  description,
  backTo,
  actions,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Back Navigation */}
      {backTo ? (
        <TenantLink to={backTo.path} global={backTo.global}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {backTo.label}
          </Button>
        </TenantLink>
      ) : (
        // back

        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>
      )}

      {/* Title and Description */}
      <div className="flex-1">
        <h1 className={cn("text-2xl font-bold", titleClassName)}>{title}</h1>
        {description && (
          <p className={cn("text-muted-foreground", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/**
 * Simplified page header for pages that don't need back navigation
 */
export function SimplePageHeader({
  title,
  description,
  actions,
  className,
  titleClassName,
  descriptionClassName,
}: Omit<PageHeaderProps, "backTo">) {
  return (
    <PageHeader
      title={title}
      description={description}
      actions={actions}
      className={className}
      titleClassName={titleClassName}
      descriptionClassName={descriptionClassName}
    />
  );
}

/**
 * Page header with breadcrumb-style navigation
 * Useful for nested pages with multiple navigation levels
 */
export interface BreadcrumbPageHeaderProps
  extends Omit<PageHeaderProps, "backTo"> {
  /**
   * Breadcrumb items for navigation
   */
  breadcrumbs: Array<{
    label: string;
    path?: string;
    global?: boolean;
  }>;
}

export function BreadcrumbPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  titleClassName,
  descriptionClassName,
}: BreadcrumbPageHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {crumb.path ? (
                <TenantLink
                  to={crumb.path}
                  global={crumb.global}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </TenantLink>
              ) : (
                <span className="text-foreground font-medium">
                  {crumb.label}
                </span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="text-muted-foreground">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className={cn("text-2xl font-bold", titleClassName)}>{title}</h1>
          {description && (
            <p className={cn("text-muted-foreground", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
