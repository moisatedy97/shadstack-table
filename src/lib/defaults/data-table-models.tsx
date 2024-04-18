import * as _tanstack_react_table from "@tanstack/react-table";
import { FilterFn, Row, RowData } from "@tanstack/react-table";

/**
 * Definisce i tipi di funzioni di filtro per una tabella di dati.
 * @param TData - Il tipo di dati delle righe della tabella.
 */
export type DataTableFilterFns<TData = RowData> = Record<string, FilterFn<TData>>;

/**
 * Contiene le funzioni di filtro per i numeri.
 */
export const dataTableNumberFilters: DataTableFilterFns = {
  equalsNumber: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as number;

    return columnValue === (filterValue as number);
  },
  notEqualsNumber: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as number;

    return columnValue !== (filterValue as number);
  },
  greaterThan: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as number;

    return columnValue > (filterValue as number);
  },
  greaterThanOrEqual: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as number;

    return columnValue >= (filterValue as number);
  },
  lessThan: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as number;

    return columnValue < (filterValue as number);
  },
  lessThanOrEqual: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as number;

    return columnValue <= (filterValue as number);
  }
};

/**
 * Contiene le funzioni di filtro per le stringhe.
 */
export const dataTableStringFilters: DataTableFilterFns = {
  startsWith: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as string;

    return columnValue.startsWith(filterValue);
  },
  startsWithSensitive: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as string;

    return columnValue.startsWith(filterValue.toLowerCase().trim());
  },
  endsWith: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as string;

    return columnValue.endsWith(filterValue);
  },
  endsWithSensitive: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as string;

    return columnValue.endsWith(filterValue.toLowerCase().trim());
  },
  notEqualsString: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as string;

    return columnValue !== filterValue;
  },
  notEqualsStringSensitive: (row, columnId, filterValue) => {
    const columnValue = row.getValue(columnId) as string;

    return columnValue.toLowerCase().trim() !== filterValue.toLowerCase().trim();
  },
  includesString: _tanstack_react_table.filterFns.includesString,
  includesStringSensitive: _tanstack_react_table.filterFns.includesStringSensitive,
  equalsString: _tanstack_react_table.filterFns.equalsString
};

export const globalFilter = <TData,>(row: Row<TData>, columnId: string, value: string) => {
  const splitValue = value.toString().split(" ");
  const columnValue = row.getValue(columnId) as string;

  const valueExists = splitValue.every((word: string) => new RegExp(word, "i").test(columnValue));

  return valueExists;
};
