import React from "react";

// Column definition interface
export interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  accessor?: keyof T | ((item: T) => any);
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

// DataTable component props
export interface DataTableProps<T> {
  // Data and loading
  data: T[];
  isLoading: boolean;

  // Table configuration
  columns: ColumnDef<T>[];

  // Search and filtering
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;

  // Card wrapper
  title: string;
  description?: string;

  // Actions
  createAction?: {
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  };

  // Empty states
  emptyMessage?: string;
  searchEmptyMessage?: string;

  // Styling
  className?: string;

  // Row key function
  getRowKey: (item: T) => string | number;
}

// Common action types for table cells
export interface TableAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive";
}

// Table cell component props
export interface TableCellProps {
  Text: {
    children: React.ReactNode;
    className?: string;
  };

  User: {
    name: string;
    subtitle?: string;
  };

  Count: {
    count: number;
    label: string;
  };

  Date: {
    date: string | Date;
  };

  Actions: {
    editHref?: string;
    onDelete?: () => void;
    deleteTitle?: string;
    deleteDescription?: string;
    additionalActions?: TableAction[];
  };
}

// Empty state types
export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
  icon?: React.ComponentType<{ className?: string }>;
}

export interface EmptyStateProps {
  variant?:
    | "empty"
    | "error"
    | "notFound"
    | "noResults"
    | "offline"
    | "unauthorized";
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: EmptyStateAction;
  className?: string;
  size?: "sm" | "md" | "lg";
}
