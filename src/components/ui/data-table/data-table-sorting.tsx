import { flexRender, Header } from "@tanstack/react-table";
import { ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import React from "react";

function DataTableSorting<TData, TValue>({
  header,
  attributes,
  listeners,
}: {
  header: Header<TData, TValue>;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}) {
  const isLongClickRef = React.useRef<boolean>(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const headerTitle = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
  const sortDirection = header.column.getIsSorted();
  const sortIndex = header.column.getSortIndex();

  const handleShortClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isLongClickRef.current) {
      header.column.getToggleSortingHandler()?.(event);
    }

    isLongClickRef.current = false;
  };

  const handleLongClick = (event: React.MouseEvent<HTMLDivElement>) => {
    timeoutRef.current = setTimeout(() => {
      isLongClickRef.current = true;
      listeners?.onMouseDown?.(event);
    }, 200);
  };

  const sortingElement = (
    <>
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
              <div className="absolute -right-1 top-1 select-none text-xs text-primary group-hover:text-primary/70">
                {sortIndex + 1}
              </div>
            </div>
          )}
        </>
      ) : (
        <ArrowDownNarrowWide className=" h-4 w-4 text-secondary/40" />
      )}
    </>
  );

  return (
    <div
      {...attributes}
      {...listeners}
      onMouseDown={handleLongClick}
      onMouseUp={handleShortClick}
      className="flex w-full items-center justify-center gap-1"
    >
      <span className="select-none text-primary">{headerTitle}</span>
      {header.column.getCanSort() && sortingElement}
    </div>
  );
}

export default DataTableSorting;
