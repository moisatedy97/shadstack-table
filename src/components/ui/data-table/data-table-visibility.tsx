import { Column, Table } from "@tanstack/react-table";
import { Eye, EyeOff } from "lucide-react";

import {
  DropdownMenuIconItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent
} from "../dropdown-menu";

function DataTableVisibility<TData>({ table }: { table: Table<TData> }) {
  const handleHide = (column: Column<TData>) => () => {
    column.toggleVisibility();
  };

  return (
    <DropdownMenuSubContent className="w-60">
      <DropdownMenuLabel>Column Visibility</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== "undefined")
        .map((column) => {
          const icon = column.getCanHide() ? column.getIsVisible() ? <Eye /> : <EyeOff /> : undefined;

          return (
            <DropdownMenuIconItem
              key={column.id}
              icon={icon}
              disabled={!column.getCanHide()}
              className="capitalize"
              onSelect={(event) => event.preventDefault()}
              onClick={handleHide(column)}
            >
              {column.id}
            </DropdownMenuIconItem>
          );
        })}
      {Object.keys(table.getState().columnVisibility).length > 0 && (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuIconItem onClick={() => table.resetColumnVisibility()}>Reset Visibility</DropdownMenuIconItem>
        </>
      )}
    </DropdownMenuSubContent>
  );
}

export default DataTableVisibility;
