import {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  FilterFn,
  functionalUpdate,
  makeStateUpdater,
  OnChangeFn,
  RowData,
  SortingState,
  Table,
  TableFeature,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";

import { dataTableNumberFilters, dataTableStringFilters } from "../defaults/data-table-models";

/**
 * Interfaccia per gli stati locali della tabella dei dati.
 */
export interface I_DataTableLocalStates {
  columnVisibility: VisibilityState;
  pinningState: ColumnPinningState;
  columnOrder: ColumnOrderState;
}

/**
 * Interfaccia per gli stati di sessione della tabella dei dati.
 */
export interface I_DataTableSessionStates {
  columnSorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnFiltersFns: ColumnFiltersFnsState;
  columnSizing: ColumnSizingState;
  columnPinning: ColumnPinningState;
  globalFilter: string | undefined;
}

/**
 * Tipo che rappresenta un'unione letterale.
 * @template T - Tipo specifico.
 * @template U - Tipo base, di default è una stringa.
 */
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);

/**
 * Tipo per le opzioni di filtro.
 */
export type FilterOption = LiteralUnion<
  string & keyof typeof dataTableNumberFilters & keyof typeof dataTableStringFilters
>;

/**
 * Stato per le funzioni di filtro delle colonne.
 */
export type ColumnFiltersFnsState = Record<string, FilterOption>;

/**
 * Stato della tabella per le funzioni di filtro delle colonne.
 */
export interface ColumnFiltersFnsTableState {
  columnFiltersFns: ColumnFiltersFnsState;
}

/**
 * Opzioni per le funzioni di filtro delle colonne.
 */
export interface ColumnFiltersFnsOptions {
  enableColumnFiltersFns?: boolean;
  onColumnFiltersFnsChange?: OnChangeFn<Record<string, FilterOption>>;
}

/**
 * Interfaccia per l'istanza delle funzioni di filtro delle colonne.
 */
export interface ColumnFiltersFnsInstance {
  setColumnFiltersFns: (updater: Updater<ColumnFiltersFnsState>) => void;
}

/**
 * Estensioni del modulo "@tanstack/react-table" per supportare le funzioni di filtro delle colonne.
 */
declare module "@tanstack/react-table" {
  // eslint-disable-next-line
  interface TableState extends ColumnFiltersFnsTableState {}
  // eslint-disable-next-line
  interface TableOptionsResolved<TData extends RowData> extends ColumnFiltersFnsOptions {}
  //eslint-disable-next-line
  interface Table<TData extends RowData> extends ColumnFiltersFnsInstance {}

  /**
   * Funzioni di filtro disponibili.
   */
  interface FilterFns {
    equalsNumber: FilterFn<RowData>;
    notEqualsNumber: FilterFn<RowData>;
    greaterThan: FilterFn<RowData>;
    greaterThanOrEqual: FilterFn<RowData>;
    lessThan: FilterFn<RowData>;
    lessThanOrEqual: FilterFn<RowData>;
    notEqualsString: FilterFn<RowData>;
    notEqualsStringSensitive: FilterFn<RowData>;
    startsWith: FilterFn<RowData>;
    startsWithSensitive: FilterFn<RowData>;
    endsWith: FilterFn<RowData>;
    endsWithSensitive: FilterFn<RowData>;
  }
}

/**
 * Caratteristica per le funzioni di filtro delle colonne.
 */
export const FiltersFnsFeature: TableFeature<unknown> = {
  getInitialState: (state): ColumnFiltersFnsTableState => {
    return {
      columnFiltersFns: {},
      ...state,
    };
  },
  getDefaultOptions: <TData extends RowData>(table: Table<TData>): ColumnFiltersFnsOptions => {
    return {
      enableColumnFiltersFns: true,
      onColumnFiltersFnsChange: makeStateUpdater("columnFiltersFns", table),
    } as ColumnFiltersFnsOptions;
  },
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setColumnFiltersFns = (updater) => {
      const safeUpdater: Updater<ColumnFiltersFnsState> = (old) => {
        const newState = functionalUpdate(updater, old);

        return newState;
      };
      return table.options.onColumnFiltersFnsChange?.(safeUpdater);
    };
  },
};
