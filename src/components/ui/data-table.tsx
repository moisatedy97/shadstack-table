import React, { useMemo, useRef } from "react";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { arrayMove } from "@dnd-kit/sortable";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import useDataTableLocalState from "@/hooks/useDataTableLocalState";
import useDataTableSessionState from "@/hooks/useDataTableSessionState";
import { dataTableDefaults } from "@/lib/defaults/data-table-defaults";
import { dataTableNumberFilters, dataTableStringFilters } from "@/lib/defaults/data-table-models";
import { ColumnFiltersFnsState, FiltersFnsFeature } from "@/lib/interfaces/data-table-states";

import DataTableBody from "./data-table/data-table-body";
import DataTableFooter from "./data-table/data-table-footer";
import DataTableHeader from "./data-table/data-table-header";
import DataTableNoResults from "./data-table/data-table-no-results";
import { Table } from "./table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  isLoading: boolean;
  onRowClick: (row: Row<TData>) => void;
}

function DataTableComponent<TData, TValue>({ columns, data, isLoading, onRowClick }: DataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [columnOrder, setColumnOrder] = useDataTableLocalState<ColumnOrderState>(
    "columnOrder",
    dataTableDefaults.columnOrder(columns),
  );
  const [columnSorting, setColumnSorting] = useDataTableSessionState<SortingState>(
    "columnSorting",
    dataTableDefaults.columnSorting(),
  );
  const [columnFilters, setColumnFilters] = useDataTableSessionState<ColumnFiltersState>(
    "columnFilters",
    dataTableDefaults.columnFilters(),
  );
  const [columnFiltersFns, setColumnFiltersFns] = useDataTableSessionState<ColumnFiltersFnsState>(
    "columnFiltersFns",
    dataTableDefaults.columnFiltersFns(columns),
  );
  const [columnVisibility, setColumnVisibility] = useDataTableLocalState<VisibilityState>(
    "columnVisibility",
    dataTableDefaults.columnVisibility(),
  );
  const [columnSizing, setColumnSizing] = useDataTableSessionState<ColumnSizingState>(
    "columnSizing",
    dataTableDefaults.columnSizing(),
  );
  const [columnPinning, setColumnPinning] = useDataTableSessionState<ColumnPinningState>(
    "columnPinning",
    dataTableDefaults.columnPinning(),
  );
  const [globalFilter, setGlobalFilter] = useDataTableSessionState<string>(
    "globalFilter",
    dataTableDefaults.globalFilter(),
  );

  const table = useReactTable<TData>({
    _features: [FiltersFnsFeature],
    data: data || [],
    columns: columns,
    rowCount: data?.length || 0,
    columnResizeMode: "onChange",
    columnResizeDirection: "ltr",
    state: {
      sorting: columnSorting,
      columnFilters: columnFilters,
      columnFiltersFns: columnFiltersFns,
      columnVisibility: columnVisibility,
      columnOrder: columnOrder,
      globalFilter: globalFilter,
      columnSizing: columnSizing,
      columnPinning: columnPinning,
    },
    filterFns: {
      equalsNumber: dataTableNumberFilters.equalsNumber,
      notEqualsNumber: dataTableNumberFilters.notEqualsNumber,
      greaterThan: dataTableNumberFilters.greaterThan,
      greaterThanOrEqual: dataTableNumberFilters.greaterThanOrEqual,
      lessThan: dataTableNumberFilters.lessThan,
      lessThanOrEqual: dataTableNumberFilters.lessThanOrEqual,
      notEqualsString: dataTableStringFilters.notEqualsString,
      notEqualsStringSensitive: dataTableStringFilters.notEqualsStringSensitive,
      startsWith: dataTableStringFilters.startsWith,
      startsWithSensitive: dataTableStringFilters.startsWithSensitive,
      endsWith: dataTableStringFilters.endsWith,
      endsWithSensitive: dataTableStringFilters.endsWithSensitive,
    },
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
    onColumnPinningChange: setColumnPinning,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
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

  const dataTableHeader = useMemo(() => {
    return <DataTableHeader table={table} />;
  }, [columnVisibility, columnOrder, columnPinning, columnFiltersFns, globalFilter]);
  const dataTableFooter = useMemo(() => {
    return <DataTableFooter table={table} />;
  }, [table.getRowModel().rows, columnPinning, columnVisibility]);

  return (
    <div className="rounded-md">
      <div className="relative">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
        >
          <div
            ref={tableContainerRef}
            className="relative h-80 overflow-auto rounded-t-md border dark:border-gray-800 dark:[color-scheme:dark]"
          >
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
        {dataTableFooter}
        {table.getRowModel().rows.length === 0 && !isLoading && <DataTableNoResults />}
      </div>
    </div>
  );
}

const DataTable = React.memo(DataTableComponent) as typeof DataTableComponent;

export default DataTable;
