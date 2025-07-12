import React from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Search, Plus } from "lucide-react";
import { TenantLink } from "~/components/tenant-link";
import { ColumnVisibility } from "~/components/ui/column-visibility";
import { useColumnVisibilityStore } from "~/lib/stores/column-visibility";
import type { ColumnDef, DataTableProps } from "~/types/data-table";

// Re-export types for convenience
export type { ColumnDef, DataTableProps } from "~/types/data-table";

// Helper function to get cell value
function getCellValue<T>(item: T, column: ColumnDef<T>): any {
  if (column.cell) {
    return column.cell(item);
  }

  if (column.accessor) {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return item[column.accessor];
  }

  return null;
}

export function DataTable<T>({
  data,
  isLoading,
  columns,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  title,
  description,
  createAction,
  emptyMessage = "No data found",
  searchEmptyMessage,
  className,
  getRowKey,
  tableKey,
  defaultColumns,
}: DataTableProps<T>) {
  const finalEmptyMessage =
    searchValue && searchEmptyMessage ? searchEmptyMessage : emptyMessage;

  const { getVisibleColumns, initializeColumns } = useColumnVisibilityStore();

  // Initialize columns on mount if tableKey and defaultColumns are provided
  React.useEffect(() => {
    if (tableKey && defaultColumns) {
      const allColumnIds = columns
        .filter((col) => col.id !== "actions" && col.header)
        .map((col) => col.id);
      initializeColumns(tableKey, allColumnIds, defaultColumns);
    }
  }, [tableKey, defaultColumns, columns, initializeColumns]);

  // Get visible columns from store
  const visibleColumns = tableKey ? getVisibleColumns(tableKey) : {};

  // Filter columns based on visibility while preserving responsive classes
  const filteredColumns = React.useMemo(() => {
    if (!tableKey || !defaultColumns) {
      return columns;
    }

    return columns.map((column) => {
      // Always show actions column
      if (column.id === "actions") {
        return column;
      }

      // Check visibility from store, default to true for default columns
      const isVisible =
        visibleColumns[column.id] !== undefined
          ? visibleColumns[column.id]
          : defaultColumns.includes(column.id);

      // If column is hidden by user, override all responsive classes with hidden
      if (!isVisible) {
        return {
          ...column,
          className: "hidden",
        };
      }

      return column;
    });
  }, [columns, visibleColumns, tableKey, defaultColumns]);

  return (
    <div className={`flex-1 space-y-4 ${className || ""}`}>
      {title && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {title}
            </h2>
            {description && (
              <p className="text-muted-foreground text-sm sm:text-base">
                {description}
              </p>
            )}
          </div>
          {createAction && (
            <TenantLink to={createAction.href}>
              <Button className="w-full sm:w-auto">
                {createAction.icon && (
                  <createAction.icon className="mr-2 h-4 w-4" />
                )}
                {createAction.label}
              </Button>
            </TenantLink>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {title && (
              <div>
                <CardTitle>All {title}</CardTitle>
                <CardDescription>
                  {data.length} {title.toLowerCase()}
                  {data.length !== 1 ? "s" : ""} found
                </CardDescription>
              </div>
            )}
            <div className="flex items-center space-x-2">
              {onSearchChange && (
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-8 w-full sm:w-64"
                  />
                </div>
              )}
              {tableKey && defaultColumns && (
                <ColumnVisibility
                  tableKey={tableKey}
                  columns={columns}
                  defaultColumns={defaultColumns}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    {filteredColumns.map((column) => (
                      <TableHead
                        key={column.id}
                        className={`${
                          column.className || ""
                        } whitespace-nowrap`}
                      >
                        {column.header}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={getRowKey(item)}>
                      {filteredColumns.map((column) => (
                        <TableCell key={column.id} className={column.className}>
                          {getCellValue(item, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {data.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={
                          filteredColumns.filter(
                            (col) => !col.className?.includes("hidden")
                          ).length
                        }
                        className="text-center py-8"
                      >
                        <div className="text-muted-foreground">
                          {finalEmptyMessage}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper components for common table patterns
export const TableActions = {
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-end">{children}</div>
  ),
};
