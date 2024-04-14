import { CSSProperties, useMemo } from "react";
import { horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Header, Table } from "@tanstack/react-table";
import { Grab } from "lucide-react";

import { Separator } from "../separator";
import { TableHead, TableHeader, TableRow } from "../table";

import DataTableFiltering from "./data-table-filtering";
import DataTableSorting from "./data-table-sorting";

function DataTableHeader<TData>({ table }: { table: Table<TData> }) {
  return (
    <TableHeader className="sticky top-0 z-10 grid bg-white shadow-md">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="flex">
          <SortableContext items={table.getState().columnOrder} strategy={horizontalListSortingStrategy}>
            {headerGroup.headers.map((header) => (
              <DataTableHead key={header.id} table={table} header={header} />
            ))}
          </SortableContext>
        </TableRow>
      ))}
    </TableHeader>
  );
}

export default DataTableHeader;

const DataTableHead = <TData, TValue>({ table, header }: { table: Table<TData>; header: Header<TData, TValue> }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } = useSortable({
    id: header.column.id
  });
  const isPinned = header.column.getIsPinned();
  const isResizing = header.column.getIsResizing();

  let separatorColor = "";

  if (header.column.getCanResize()) {
    if (isResizing) {
      separatorColor = "bg-primary cursor-col-resize";
    } else {
      separatorColor = "bg-primary/50";
    }
  } else {
    separatorColor = "bg-secondary/40 cursor-not-allowed";
  }

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    backgroundColor: isDragging ? "rgb(3 105 161 / 0.4)" : "",

    position: isPinned ? "sticky" : "relative",
    // opacity: isDragging || isPinned ? 0.8 : 1,
    zIndex: isDragging || isPinned ? 20 : 0,
    left: isPinned === "left" ? `${header.column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${header.column.getAfter("right")}px` : undefined
  };

  const sortingState = table.getState().sorting;
  const headerFilteringState = table.getState().columnFilters.find((filter) => filter.id === header.column.id);
  const tableHeadSorting = useMemo(
    () => <DataTableSorting header={header} isDragging={isDragging} />,
    [sortingState, isDragging, header]
  );
  const tableHeadFiltering = useMemo(() => <DataTableFiltering header={header} />, [headerFilteringState]);

  return (
    <TableHead colSpan={header.colSpan} ref={setNodeRef} style={style} className="my-1 flex gap-1">
      {tableHeadSorting}
      {tableHeadFiltering}
      <Separator
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`h-full w-0.5 cursor-col-resize touch-none select-none ${separatorColor}`}
      />
      <div className="absolute -bottom-3 flex w-full items-center justify-center">
        <Grab
          {...attributes}
          {...listeners}
          className="h-4 cursor-grabbing touch-none select-none fill-white outline-none"
        />
      </div>
    </TableHead>
  );
};
