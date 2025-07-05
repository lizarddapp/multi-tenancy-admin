import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ColumnVisibilityState {
  // Store column visibility by table key
  columnVisibility: Record<string, Record<string, boolean>>;

  // Actions
  setColumnVisibility: (
    tableKey: string,
    columnId: string,
    visible: boolean
  ) => void;
  toggleColumn: (tableKey: string, columnId: string) => void;
  resetColumns: (tableKey: string, defaultColumns: string[]) => void;
  getVisibleColumns: (tableKey: string) => Record<string, boolean>;
  initializeColumns: (
    tableKey: string,
    allColumns: string[],
    defaultColumns: string[]
  ) => void;
}

export const useColumnVisibilityStore = create<ColumnVisibilityState>()(
  persist(
    (set, get) => ({
      columnVisibility: {},

      setColumnVisibility: (
        tableKey: string,
        columnId: string,
        visible: boolean
      ) =>
        set((state) => ({
          columnVisibility: {
            ...state.columnVisibility,
            [tableKey]: {
              ...state.columnVisibility[tableKey],
              [columnId]: visible,
            },
          },
        })),

      toggleColumn: (tableKey: string, columnId: string) =>
        set((state) => {
          const currentVisibility =
            state.columnVisibility[tableKey]?.[columnId] ?? false;
          return {
            columnVisibility: {
              ...state.columnVisibility,
              [tableKey]: {
                ...state.columnVisibility[tableKey],
                [columnId]: !currentVisibility,
              },
            },
          };
        }),

      resetColumns: (tableKey: string, defaultColumns: string[]) =>
        set((state) => {
          const currentVisibility = state.columnVisibility[tableKey] || {};
          const newVisibility: Record<string, boolean> = {};

          // Reset all existing columns
          Object.keys(currentVisibility).forEach((columnId) => {
            newVisibility[columnId] = defaultColumns.includes(columnId);
          });

          return {
            columnVisibility: {
              ...state.columnVisibility,
              [tableKey]: newVisibility,
            },
          };
        }),

      getVisibleColumns: (tableKey: string) => {
        const state = get();
        return state.columnVisibility[tableKey] || {};
      },

      initializeColumns: (
        tableKey: string,
        allColumns: string[],
        defaultColumns: string[]
      ) =>
        set((state) => {
          // Only initialize if not already set
          if (!state.columnVisibility[tableKey]) {
            const newVisibility: Record<string, boolean> = {};
            allColumns.forEach((columnId) => {
              // Set to true if it's in defaultColumns, false otherwise
              newVisibility[columnId] = defaultColumns.includes(columnId);
            });

            return {
              columnVisibility: {
                ...state.columnVisibility,
                [tableKey]: newVisibility,
              },
            };
          }
          return state;
        }),
    }),
    {
      name: "column-visibility-storage",
      // Only persist the columnVisibility object
      partialize: (state) => ({ columnVisibility: state.columnVisibility }),
    }
  )
);
