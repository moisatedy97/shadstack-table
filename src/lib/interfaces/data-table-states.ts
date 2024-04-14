import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  InitialTableState,
  OnChangeFn,
  RowData,
  SortingState,
  Table,
  TableFeature,
  Updater,
  VisibilityState,
  functionalUpdate,
  makeStateUpdater
} from "@tanstack/react-table";

export interface I_DataTableLocalStates {
  columnVisibility: VisibilityState;
  pinningState: ColumnPinningState;
  columnOrder: ColumnOrderState;
}

export interface I_DataTableSessionStates {
  columnSorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnFiltersFns: ColumnFiltersFnsState;
  columnSizing: ColumnSizingState;
  globalFilter: string | undefined;
}

export type FiltersFnsState = {
  id: string;
  filterFn: string;
};

export type ColumnFiltersFnsState = FiltersFnsState[];

export interface ColumnFiltersFnsTableState {
  columnFiltersFns: ColumnFiltersFnsState;
}

export interface ColumnFiltersFnsOptions {
  enableColumnFiltersFns?: boolean;
  onColumnFiltersFnsChange?: OnChangeFn<ColumnFiltersFnsState>;
}

export interface ColumnFiltersFnsInstance {
  setColumnFiltersFns: (updater: Updater<ColumnFiltersFnsState>) => void;
}

declare module "@tanstack/react-table" {
  interface TableState extends ColumnFiltersFnsTableState {}
  interface TableOptionsResolved<TData extends RowData> extends ColumnFiltersFnsOptions {}
  interface Table<TData extends RowData> extends ColumnFiltersFnsInstance {}
}

export const FiltersFnsFeature: TableFeature<unknown> = {
  getInitialState: (state: InitialTableState | undefined): ColumnFiltersFnsTableState => {
    return {
      columnFiltersFns: [],
      ...state
    };
  },
  getDefaultOptions: <TData extends RowData>(table: Table<TData>): ColumnFiltersFnsOptions => {
    return {
      enableColumnFiltersFns: true,
      onColumnFiltersFnsChange: makeStateUpdater("columnFiltersFns", table)
    } as ColumnFiltersFnsOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnFiltersFns = (updater) => {
      const safeUpdater: Updater<ColumnFiltersFnsState> = (old) => {
        let newState = functionalUpdate(updater, old);
        return newState;
      };
      return table.options.onColumnFiltersFnsChange?.(safeUpdater);
    };
  }
};
