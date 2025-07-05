import React from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Columns3, RotateCcw } from "lucide-react";
import { useColumnVisibilityStore } from "~/lib/stores/column-visibility";
import type { ColumnDef } from "~/types/data-table";

interface ColumnVisibilityProps<T> {
  tableKey: string;
  columns: ColumnDef<T>[];
  defaultColumns: string[];
}

export function ColumnVisibility<T>({
  tableKey,
  columns,
  defaultColumns,
}: ColumnVisibilityProps<T>) {
  const { getVisibleColumns, toggleColumn, resetColumns, initializeColumns } =
    useColumnVisibilityStore();

  // Get displayable columns (exclude actions and other special columns)
  const displayableColumns = React.useMemo(
    () => columns.filter((column) => column.id !== "actions" && column.header),
    [columns]
  );

  // Initialize columns on mount
  React.useEffect(() => {
    const allColumnIds = displayableColumns.map((col) => col.id);
    initializeColumns(tableKey, allColumnIds, defaultColumns);
  }, [tableKey, defaultColumns, displayableColumns, initializeColumns]);

  const visibleColumns = getVisibleColumns(tableKey);

  // Get column visibility with fallback to store value
  const isColumnVisible = (columnId: string) => {
    if (visibleColumns[columnId] !== undefined) {
      return visibleColumns[columnId];
    }
    return defaultColumns.includes(columnId);
  };

  const handleToggleColumn = (columnId: string) => {
    toggleColumn(tableKey, columnId);
  };

  const handleReset = () => {
    resetColumns(tableKey, defaultColumns);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-2">
          <Columns3 className="h-4 w-4" />
          <span className="hidden sm:inline">Columns</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Toggle columns</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-6 w-6 p-0"
            title="Reset to default"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {displayableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={isColumnVisible(column.id)}
            onCheckedChange={() => handleToggleColumn(column.id)}
          >
            {column.header}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
