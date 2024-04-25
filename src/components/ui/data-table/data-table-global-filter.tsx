import React from "react";
import { Table } from "@tanstack/react-table";

import useDebounceFn from "@/hooks/useDebounceFn";

import { Input } from "../input";

/**
 * Componente per il filtro globale della tabella dati.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {Table} props.table - L'istanza della tabella a cui applicare il filtro globale.
 * @returns {React.JSX.Element} Elemento JSX del filtro globale per la tabella dati.
 */
function DataTableGlobalFilter<TData>({ table }: { table: Table<TData> }): React.JSX.Element {
  const [value, setValue] = React.useState<string>("");

  /**
   * Gestisce il cambiamento del filtro globale con debounce.
   * Imposta il filtro globale della tabella al valore corrente dopo un ritardo di 500ms.
   */
  const handleGlobalFilterChange = useDebounceFn(() => {
    table.setGlobalFilter(value);
  }, 500);

  /**
   * Gestisce il cambiamento del valore dell'input e aggiorna il filtro globale della tabella.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - L'evento di cambiamento dell'input.
   */
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    handleGlobalFilterChange();
  };

  return (
    <div>
      <Input onChange={handleValueChange} placeholder="Global Filter" className="h-8 w-60" />
    </div>
  );
}

export default DataTableGlobalFilter;
