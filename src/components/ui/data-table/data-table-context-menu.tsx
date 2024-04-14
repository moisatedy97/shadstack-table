import React from "react";
import { Table } from "@tanstack/react-table";
import { ArrowDownAZ, ArrowLeftRight, Eye, Filter, FilterX, ListOrdered } from "lucide-react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuIconItem,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from "../context-menu";

import DataTableVisibility from "./data-table-visibility";

/**
 * Funzione per creare un menu contestuale per la tabella dei dati.
 *
 * @template TData Il tipo di dati gestiti dalla tabella.
 * @param {Object} props Le proprietà passate al componente.
 */
function DataTableContextMenu<TData>({
  table,
  children
}: {
  table: Table<TData>;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Impostazioni</ContextMenuLabel>

        <ContextMenuSeparator />

        <ContextMenuItem
          onClick={() => table.setGlobalFilter(table.getState().globalFilter !== undefined ? undefined : "")}
        >
          {table.getState().globalFilter !== undefined ? "Hide Global Filter" : "Show Global Filter"}
        </ContextMenuItem>
        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger icon={<Eye />} inset>
            Column Visibility
          </ContextMenuSubTrigger>
          <DataTableVisibility table={table} />
        </ContextMenuSub>

        {/* <ContextMenuSub>
          <ContextMenuSubTrigger icon={<Pin />} inset>
            Column Pinning
          </ContextMenuSubTrigger>
          <DataTablePinning table={table} />
        </ContextMenuSub> */}

        <ContextMenuSeparator />

        <ContextMenuIconItem
          icon={<ListOrdered />}
          onClick={() => table.setColumnOrder(table.getAllColumns().map((column) => column.id))}
        >
          Reset Order
        </ContextMenuIconItem>

        <ContextMenuIconItem icon={<ArrowLeftRight />} onClick={() => table.resetColumnSizing()}>
          Reset Resizing
        </ContextMenuIconItem>

        {table.getState().sorting.length > 0 && (
          <ContextMenuIconItem icon={<ArrowDownAZ />} onClick={() => table.resetSorting()}>
            Reset Sorting
          </ContextMenuIconItem>
        )}

        {table.getState().columnFilters.length > 0 && (
          <ContextMenuIconItem icon={<Filter />} onClick={() => table.resetColumnFilters()}>
            Reset Filters
          </ContextMenuIconItem>
        )}

        {table.getState().globalFilter && (
          <ContextMenuIconItem icon={<FilterX />} onClick={() => table.resetGlobalFilter()}>
            Reset Global Filter
          </ContextMenuIconItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default DataTableContextMenu;
