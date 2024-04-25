import { Table } from "@tanstack/react-table";
import { ArrowUpWideNarrow, Filter } from "lucide-react";

import DataTableGlobalFilter from "./data-table-global-filter";
import DataTableSettings from "./data-table-settings";

function DataTableFooter<TData>({ table }: { table: Table<TData> }) {
  return (
    <div className="flex h-10 items-center justify-between rounded-b-md border border-t-0 px-6 dark:border-gray-800">
      <div className="flex items-center gap-6">
        <DataTableSettings table={table} />
        <DataTableFooterStateInfo table={table} />
        <DataTableGlobalFilter table={table} />
      </div>
      <DataTableRowInfo table={table} />
    </div>
  );
}

export default DataTableFooter;

const DataTableFooterStateInfo = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-1">
        <Filter className="size-4 text-secondary" />
        <span className="font-semibold text-primary">{table.getState().columnFilters.length}</span>
      </div>
      <div className="flex items-center gap-1">
        <ArrowUpWideNarrow className="size-4 text-secondary" />
        <span className="font-semibold text-primary">{table.getState().sorting.length}</span>
      </div>
    </div>
  );
};

const DataTableRowInfo = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <div className="flex gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-secondary">Rows</span>
        <span className="font-semibold text-primary">{table.getFilteredRowModel().flatRows.length}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-secondary">Total Rows</span>
        <span className="font-semibold text-primary">{table.getRowCount()}</span>
      </div>
    </div>
  );
};
