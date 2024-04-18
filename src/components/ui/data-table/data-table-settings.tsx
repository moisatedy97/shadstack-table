import React from "react";
import { Table } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowLeftRight, Eye, Filter, FilterX, ListOrdered, Settings } from "lucide-react";

import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuIconItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "../dropdown-menu";

import DataTableVisibility from "./data-table-visibility";

function DataTableSettings<TData>({ table }: { table: Table<TData> }): React.JSX.Element {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <Button size="icon" variant="icon" className="size-8">
            <Settings className="size-5 text-sm font-semibold text-secondary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" className="w-60">
          <DropdownMenuLabel>Settings</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger icon={<Eye />} inset={true}>
              Column Visibility
            </DropdownMenuSubTrigger>
            <DataTableVisibility table={table} />
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <ResetActions table={table} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default DataTableSettings;

const ResetActions = <TData,>({ table }: { table: Table<TData> }) => {
  return (
    <>
      <DropdownMenuIconItem
        icon={<ListOrdered />}
        onClick={() => table.setColumnOrder(table.getAllColumns().map((column) => column.id))}
      >
        Reset Order
      </DropdownMenuIconItem>

      <DropdownMenuIconItem icon={<ArrowLeftRight />} onClick={() => table.resetColumnSizing()}>
        Reset Resizing
      </DropdownMenuIconItem>

      {table.getState().sorting.length > 0 && (
        <DropdownMenuIconItem icon={<ArrowDownAZ />} onClick={() => table.resetSorting()}>
          Reset Sorting
        </DropdownMenuIconItem>
      )}

      {table.getState().columnFilters.length > 0 && (
        <DropdownMenuIconItem icon={<Filter />} onClick={() => table.resetColumnFilters()}>
          Reset Filters
        </DropdownMenuIconItem>
      )}

      {table.getState().globalFilter && (
        <DropdownMenuIconItem icon={<FilterX />} onClick={() => table.resetGlobalFilter()}>
          Reset Global Filter
        </DropdownMenuIconItem>
      )}
    </>
  );
};
