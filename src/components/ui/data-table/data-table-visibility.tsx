import { Column, Table } from "@tanstack/react-table";
import { Eye, EyeOff } from "lucide-react";

import { ContextMenuIconItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSubContent } from "../context-menu";

function DataTableVisibility<TData>({ table }: { table: Table<TData> }) {
  const handleHide = (column: Column<TData>) => () => {
    column.toggleVisibility();
  };

  return (
    <ContextMenuSubContent className="w-48">
      <ContextMenuLabel>Column Visibility</ContextMenuLabel>
      <ContextMenuSeparator />
      {table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== "undefined")
        .map((column) => {
          const icon = column.getCanHide() ? column.getIsVisible() ? <Eye /> : <EyeOff /> : undefined;

          return (
            <ContextMenuIconItem
              key={column.id}
              icon={icon}
              disabled={!column.getCanHide()}
              className="capitalize"
              onSelect={(event) => event.preventDefault()}
              onClick={handleHide(column)}
            >
              {column.id}
            </ContextMenuIconItem>
          );
        })}
      {Object.keys(table.getState().columnVisibility).length > 0 && (
        <>
          <ContextMenuSeparator />
          <ContextMenuIconItem onClick={() => table.resetColumnVisibility()}>Reset Visibility</ContextMenuIconItem>
        </>
      )}
    </ContextMenuSubContent>
  );
}

export default DataTableVisibility;
