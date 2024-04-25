import { CSSProperties, useMemo } from "react";
import { horizontalListSortingStrategy, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Header, Table } from "@tanstack/react-table";

import { TableHead, TableHeader, TableRow } from "../table";

import DataTableFiltering from "./data-table-filtering";
import DataTableHeaderContextMenu from "./data-table-header-context-menu";
import DataTableOrdering from "./data-table-ordering";
import DataTableResizing from "./data-table-resizing";
import DataTableSorting from "./data-table-sorting";
import { cn } from "@/lib/utils";

function DataTableHeader<TData>({ table }: { table: Table<TData> }) {
  return (
    <TableHeader className="sticky top-0 z-10 grid border-b bg-white shadow-md dark:border-gray-800 dark:bg-black">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="flex border-none bg-white hover:bg-white dark:bg-black dark:hover:bg-black"
        >
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
  const headerFilteringState = table.getState().columnFilters.find((filter) => filter.id === header.column.id);
  const headerFilteringFnsState = table.getState().columnFiltersFns[header.column.id];
  const sortingState = table.getState().sorting;
  const isPinned = header.column.getIsPinned();

  const style: CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),

    position: isPinned ? "sticky" : "relative",
    // opacity: isDragging || isPinned ? 0.8 : 1,
    zIndex: isDragging || isPinned ? 20 : 0,
    left: isPinned === "left" ? `${header.column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${header.column.getAfter("right")}px` : undefined,
  };

  const classNames = cn("flex", isDragging ? "bg-primary/50" : "bg-inherit");

  const tableHeadOrdering = useMemo(() => {
    return <DataTableOrdering attributes={attributes} listeners={listeners} />;
  }, [isDragging]);

  const tableHeadSorting = useMemo(() => {
    return <DataTableSorting header={header} />;
  }, [sortingState]);

  const tableHeadFiltering = useMemo(() => {
    return <DataTableFiltering header={header} />;
  }, [headerFilteringState, headerFilteringFnsState, table.getPreFilteredRowModel().flatRows]);

  return (
    <DataTableHeaderContextMenu header={header}>
      <TableHead colSpan={header.colSpan} ref={setNodeRef} style={style} className={classNames}>
        <div className={`ml-0.5 mr-1 flex flex-1 gap-1 py-1`}>
          {tableHeadOrdering}
          {tableHeadSorting}
          {tableHeadFiltering}
        </div>
        <DataTableResizing header={header} />
      </TableHead>
    </DataTableHeaderContextMenu>
  );
};
