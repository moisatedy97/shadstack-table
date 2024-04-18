import { flexRender, Header } from "@tanstack/react-table";
import { ArrowDownNarrowWide, ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";

function DataTableSorting<TData, TValue>({ header }: { header: Header<TData, TValue> }) {
  const headerTitle = header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext());
  const sortDirection = header.column.getIsSorted();
  const sortIndex = header.column.getSortIndex();
  const sortedColumnsLength = header.getContext().table.getState().sorting.length;

  const sortingElement = (
    <>
      {sortDirection ? (
        <>
          {sortDirection === "asc" ? (
            <div className="flex">
              <ArrowUpNarrowWide className="h-4 w-4 text-primary group-hover:text-primary/70" />
              {sortedColumnsLength > 1 && (
                <sup className="text-xs text-primary group-hover:text-primary/70">{sortIndex + 1}</sup>
              )}
            </div>
          ) : (
            <div className="flex">
              <ArrowDownWideNarrow className="h-4 w-4 text-primary group-hover:text-primary/70" />
              {sortedColumnsLength > 1 && (
                <sub className="text-xs text-primary group-hover:text-primary/70">{sortIndex + 1}</sub>
              )}
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
      onClick={header.column.getToggleSortingHandler()}
      className={`group flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-md hover:bg-primary/10`}
    >
      <span className="select-none text-primary group-hover:text-primary/70">{headerTitle}</span>
      {header.column.getCanSort() && sortingElement}
    </div>
  );
}

export default DataTableSorting;
