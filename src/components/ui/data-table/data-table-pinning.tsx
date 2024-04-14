import { Column, Table } from "@tanstack/react-table";
import { Pin, PinOff } from "lucide-react";

import { ContextMenuIconItem, ContextMenuLabel, ContextMenuSeparator, ContextMenuSubContent } from "../context-menu";

function DataTablePinning<TData>({ table }: { table: Table<TData> }) {
  const handlePin = (column: Column<TData>) => () => {
    if (column.getIsPinned() === "left") {
      column.pin(false);
    } else {
      column.pin("left");
    }
  };

  return (
    <ContextMenuSubContent className="w-48">
      <ContextMenuLabel>Column Pinning</ContextMenuLabel>
      <ContextMenuSeparator />
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
            <ContextMenuIconItem
              key={column.id}
              icon={icon}
              disabled={!column.getCanPin()}
              className="capitalize"
              onSelect={(event) => event.preventDefault()}
              onClick={handlePin(column)}
            >
              {column.id}
            </ContextMenuIconItem>
          );
        })}
      {Object.keys(table.getState().columnPinning).length > 0 && (
        <>
          <ContextMenuSeparator />
          <ContextMenuIconItem onClick={() => table.resetColumnPinning()}>Reset Pinning</ContextMenuIconItem>
        </>
      )}
    </ContextMenuSubContent>
  );
}

export default DataTablePinning;
