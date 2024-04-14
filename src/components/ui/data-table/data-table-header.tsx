import { SortableContext, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Header, Table } from "@tanstack/react-table";
import { CSSProperties, useMemo } from "react";

import { Separator } from "../separator";
import { TableHead, TableHeader, TableRow } from "../table";

import DataTableFiltering from "./data-table-filtering";
import DataTableSorting from "./data-table-sorting";
import DataTableResizing from "./data-table-resizing";

function DataTableHeader<TData>({ table }: { table: Table<TData> }) {
  console.log("TableHeader");

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
    id: header.column.id,
  });
  const isPinned = header.column.getIsPinned();

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
    right: isPinned === "right" ? `${header.column.getAfter("right")}px` : undefined,
  };

  const sortingState = table.getState().sorting;
  const headerFilteringState = table.getState().columnFilters.find((filter) => filter.id === header.column.id);
  const tableHeadSorting = useMemo(
    () => <DataTableSorting header={header} attributes={attributes} listeners={listeners} />,
    [sortingState, isDragging, header, attributes, listeners],
  );
  const tableHeadFiltering = useMemo(() => <DataTableFiltering header={header} />, [headerFilteringState]);

  return (
    <TableHead colSpan={header.colSpan} ref={setNodeRef} style={style} className="flex w-full">
      <div
        className={`relative my-0.5 ml-0.5 mr-1 flex-1 cursor-grabbing rounded-md px-1 py-1.5 hover:bg-primary/10 ${isDragging ? "cursor-grab" : ""}`}
      >
        {tableHeadSorting}
        {tableHeadFiltering}
      </div>
      <DataTableResizing header={header} />
    </TableHead>
  );
};
