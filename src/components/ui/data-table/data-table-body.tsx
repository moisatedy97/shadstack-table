import { CSSProperties } from "react";
import { horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Cell, flexRender, Row, Table } from "@tanstack/react-table";
import { Virtualizer } from "@tanstack/react-virtual";

import { Skeleton } from "../skeleton";
import { TableBody, TableCell, TableRow } from "../table";

function DataTableBody<TData>({
  table,
  rowVirtualizer,
  isLoading,
  onRowClick,
}: {
  table: Table<TData>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  isLoading: boolean;
  onRowClick: (row: Row<TData>) => void;
}) {
  const { rows } = table.getRowModel();

  const handleRowClick = (row: Row<TData>) => () => {
    onRowClick(row);
  };

  if (isLoading) {
    return (
      <TableBody className="relative grid h-full">
        {[...Array(5)].map((_, index) => (
          <TableRow key={index} className="flex w-full">
            <TableCell className="flex-1">
              <Skeleton className="h-5 w-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  }

  return (
    <TableBody className="relative grid" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const row = rows[virtualRow.index] as Row<TData>;
        return (
          <TableRow
            key={row.id}
            className="absolute flex w-full dark:text-white"
            data-index={virtualRow.index}
            ref={(node) => rowVirtualizer.measureElement(node)}
            style={{ transform: `translateY(${virtualRow.start}px)` }}
            onClick={handleRowClick(row)}
          >
            {row.getVisibleCells().map((cell) => {
              return (
                <SortableContext
                  key={cell.id}
                  items={table.getState().columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  <DragAlongCell key={cell.id} cell={cell} />
                </SortableContext>
              );
            })}
          </TableRow>
        );
      })}
    </TableBody>
  );
}

export default DataTableBody;

const DragAlongCell = <TData, TValue>({ cell }: { cell: Cell<TData, TValue> }) => {
  const { isDragging, setNodeRef, transform } = useSortable({
    id: cell.column.id,
  });
  const isPinned = cell.column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === "left" && cell.column.getIsLastColumn("left");
  const isFirstRightPinnedColumn = isPinned === "right" && cell.column.getIsFirstColumn("right");

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    width: cell.column.getSize(),

    position: isPinned ? "sticky" : "relative",
    // opacity: isDragging || isPinned ? 0.8 : 1,
    zIndex: isDragging || isPinned ? 20 : 0,
    boxShadow: isLastLeftPinnedColumn
      ? "-4px 0 4px -4px gray inset"
      : isFirstRightPinnedColumn
        ? "4px 0 4px -4px gray inset"
        : undefined,
    left: isPinned === "left" ? `${cell.column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${cell.column.getAfter("right")}px` : undefined,
  };

  return (
    <TableCell style={style} ref={setNodeRef} className={`flex ${isDragging ? "bg-primary/50" : ""}`}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};
