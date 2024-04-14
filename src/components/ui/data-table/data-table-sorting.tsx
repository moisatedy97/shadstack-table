import { flexRender, Header } from "@tanstack/react-table";
import { ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

import { Button } from "../button";

function DataTableSorting<TData, TValue>({
  header,
  isDragging
}: {
  header: Header<TData, TValue>;
  isDragging: boolean;
}) {
  const headerTitle = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
  const sortDirection = header.column.getIsSorted();
  const sortIndex = header.column.getSortIndex();

  return (
    <Button
      variant={"ghost"}
      disabled={isDragging}
      className="group h-8 w-full cursor-pointer text-primary hover:text-primary/70"
      onClick={header.column.getToggleSortingHandler()}
    >
      {!header.column.getCanSort() ? (
        headerTitle
      ) : (
        <div className="flex items-center gap-1">
          {headerTitle}
          {sortDirection ? (
            <>
              {sortDirection === "asc" ? (
                <div className="relative">
                  <ArrowUpNarrowWide className="h-4 w-4 text-primary group-hover:text-primary/70" />
                  <div className="absolute -right-1 -top-1 text-xs text-primary group-hover:text-primary/70">
                    {sortIndex + 1}
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <ArrowDownWideNarrow className="h-4 w-4 text-primary group-hover:text-primary/70" />
                  <div className="absolute -right-1 top-1 text-xs text-primary group-hover:text-primary/70">
                    {sortIndex + 1}
                  </div>
                </div>
              )}
            </>
          ) : (
            <ArrowDownNarrowWide className=" h-4 w-4 text-secondary/40" />
          )}
        </div>
      )}
    </Button>
  );
}

export default DataTableSorting;
