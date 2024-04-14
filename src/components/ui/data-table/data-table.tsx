import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  Row,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useMemo, useRef } from "react";

import useDataTableLocalState from "@/hooks/useDataTableLocalState";
import useDataTableSessionState from "@/hooks/useDataTableSessionState";

import { Table } from "../table";

import { ColumnFiltersFnsState, FiltersFnsFeature } from "@/lib/interfaces/data-table-states";
import DataTableBody from "./data-table-body";
import DataTableContextMenu from "./data-table-context-menu";
import DataTableGlobalFilter from "./data-table-global-filter";
import DataTableHeader from "./data-table-header";
import DataTableNoResults from "./data-table-no-results";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  isLoading: boolean;
  onRowClick?: (row: Row<TData>) => void;
}

function DataTableComponent<TData, TValue>({ columns, data, isLoading, onRowClick }: DataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const getColumns = () => columns.map((column) => column.id!);
  const getFilterFns = () =>
    columns.map((column) => ({ id: column.id!, filterFn: (column.filterFn as string) ?? "equals" }));

  const [columnOrder, setColumnOrder] = useDataTableLocalState<ColumnOrderState>("columnOrder", getColumns());
  const [columnSorting, setColumnSorting] = useDataTableSessionState<SortingState>("columnSorting", []);
  const [columnFilters, setColumnFilters] = useDataTableSessionState<ColumnFiltersState>("columnFilters", []);
  const [columnFiltersFns, setColumnFiltersFns] = useDataTableSessionState<ColumnFiltersFnsState>(
    "columnFiltersFns",
    getFilterFns(),
  );
  const [columnVisibility, setColumnVisibility] = useDataTableLocalState<VisibilityState>("columnVisibility", {});
  const [columnSizing, setColumnSizing] = useDataTableSessionState<ColumnSizingState>("columnSizing", {});
  const [globalFilter, setGlobalFilter] = useDataTableSessionState<string | undefined>("globalFilter", undefined);

  const table = useReactTable<TData>({
    data: data || [],
    columns: columns,
    _features: [FiltersFnsFeature],
    state: {
      sorting: columnSorting,
      columnFilters: columnFilters,
      columnFiltersFns: columnFiltersFns,
      columnVisibility: columnVisibility,
      columnOrder: columnOrder,
      globalFilter: globalFilter,
      columnSizing: columnSizing,
    },
    rowCount: data?.length || 0,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setColumnSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnFiltersFnsChange: setColumnFiltersFns,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
  });
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));
  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 28,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== "undefined" && navigator.userAgent.indexOf("Firefox") === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  };

  const dataTableHeader = useMemo(
    () => <DataTableHeader table={table} />,
    [columnVisibility, columnOrder, columnFiltersFns, globalFilter],
  );

  return (
    <DataTableContextMenu table={table}>
      <div className="rounded-md border">
        <div className="relative">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <div ref={tableContainerRef} className="relative h-[20rem] overflow-auto">
              <Table className="grid">
                {dataTableHeader}
                <DataTableBody
                  table={table}
                  rowVirtualizer={rowVirtualizer}
                  isLoading={isLoading}
                  onRowClick={onRowClick}
                />
              </Table>
            </div>
          </DndContext>
          {globalFilter !== undefined && <DataTableGlobalFilter table={table} />}
          {table.getRowModel().rows.length === 0 && !isLoading && <DataTableNoResults />}
        </div>
      </div>
    </DataTableContextMenu>
  );
}

const DataTable = React.memo(DataTableComponent) as typeof DataTableComponent;

export default DataTable;
