import {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  SortingState,
  VisibilityState
} from "@tanstack/react-table";

import { ColumnFiltersFnsState } from "../interfaces/data-table-states";

export const dataTableDefaults = {
  columnOrder: <TData, TValue>(columns: ColumnDef<TData, TValue>[]): ColumnOrderState => {
    return columns.map((column) => column.id!);
  },
  columnSorting: (): SortingState => [],
  columnFilters: (): ColumnFiltersState => [],
  columnFiltersFns: <TData, TValue>(columns: ColumnDef<TData, TValue>[]): ColumnFiltersFnsState => {
    return columns.reduce((acc, column) => {
      if (!column.filterFn) {
        return { ...acc, [column.id!]: undefined };
      }

      return { ...acc, [column.id!]: typeof column.filterFn === "string" ? column.filterFn : "" };
    }, {});
  },
  columnVisibility: (): VisibilityState => ({}),
  columnSizing: (): ColumnSizingState => ({}),
  globalFilter: (): string => ""
};
