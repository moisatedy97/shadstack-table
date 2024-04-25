import { Column, Table } from "@tanstack/react-table";
import { Pin, PinOff } from "lucide-react";

import {
  DropdownMenuIconItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
} from "../dropdown-menu";

function DataTablePinning<TData>({ table }: { table: Table<TData> }) {
  const handlePin = (column: Column<TData>) => () => {
    if (column.getIsPinned() === "left") {
      column.pin(false);
    } else {
      column.pin("left");
    }
  };

  return (
    <DropdownMenuSubContent className="w-48">
      <DropdownMenuLabel>Column Pinning</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {table
        .getAllColumns()
        .filter((column) => typeof column.accessorFn !== "undefined")
        .map((column) => {
          const icon = column.getCanPin() ? (
            column.getIsPinned() === "left" ? (
              <Pin className="rotate-90" />
            ) : column.getIsPinned() === "right" ? (
              <Pin className="-rotate-90" />
            ) : (
              <PinOff />
            )
          ) : undefined;

          return (
            <DropdownMenuIconItem
              key={column.id}
              icon={icon}
              disabled={!column.getCanPin()}
              className="capitalize"
              onSelect={(event) => event.preventDefault()}
              onClick={handlePin(column)}
            >
              {column.id}
            </DropdownMenuIconItem>
          );
        })}
      {Object.keys(table.getState().columnPinning).length > 0 && (
        <>
          <DropdownMenuSeparator />
          {table.getAllColumns().some((column) => column.getIsPinned()) && (
            <DropdownMenuIconItem icon={<PinOff />} onClick={() => table.resetColumnPinning()}>
              Reset Pinning
            </DropdownMenuIconItem>
          )}
        </>
      )}
    </DropdownMenuSubContent>
  );
}

export default DataTablePinning;
