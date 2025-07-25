import React from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { TenantLink } from "~/components/tenant-link";

// Common table cell components
export const TableCells = {
  // Standard text cell - for most simple text display
  Text: ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <span className={className}>{children}</span>,

  // User cell with name and subtitle (complex cell)
  User: ({ name, subtitle }: { name: string; subtitle?: string }) => (
    <div>
      <div className="font-medium">{name}</div>
      {subtitle && (
        <div className="text-sm text-muted-foreground">{subtitle}</div>
      )}
    </div>
  ),

  // Date cell with consistent formatting
  Date: ({ date }: { date: string | Date }) => (
    <span className="text-sm text-muted-foreground">
      {new Date(date).toLocaleDateString()}
    </span>
  ),

  // Count display with proper pluralization
  Count: ({ count, label }: { count: number; label: string }) => (
    <span className="text-sm text-muted-foreground">
      {count} {label}
      {count !== 1 ? "s" : ""}
    </span>
  ),

  // Actions dropdown
  Actions: ({
    editHref,
    onDelete,
    deleteTitle,
    deleteDescription,
    additionalActions = [],
  }: {
    editHref?: string;
    onDelete?: () => void;
    deleteTitle?: string;
    deleteDescription?: string;
    additionalActions?: Array<{
      label: string;
      icon: React.ComponentType<{ className?: string }>;
      onClick: () => void;
      variant?: "default" | "destructive";
    }>;
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {editHref && (
          <DropdownMenuItem asChild>
            <TenantLink to={editHref}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </TenantLink>
          </DropdownMenuItem>
        )}
        {additionalActions.map((action, index) => (
          <DropdownMenuItem
            key={index}
            onClick={action.onClick}
            className={
              action.variant === "destructive" ? "text-destructive" : ""
            }
          >
            <action.icon className="mr-2 h-4 w-4" />
            {action.label}
          </DropdownMenuItem>
        ))}
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {deleteTitle || "Delete Item"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {deleteDescription ||
                    "Are you sure you want to delete this item? This action cannot be undone."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
