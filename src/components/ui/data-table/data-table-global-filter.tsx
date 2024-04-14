import React from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import useDebounceFn from "@/hooks/useDebounceFn";

import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";

/**
 * Componente per il filtro globale della tabella dati.
 *
 * @param {Object} props - Le proprietà del componente.
 * @param {Table<TData>} props.table - L'istanza della tabella a cui applicare il filtro globale.
 * @returns {React.JSX.Element} - L'elemento JSX del filtro globale.
 */
function DataTableGlobalFilter<TData>({ table }: { table: Table<TData> }): React.JSX.Element {
  const [value, setValue] = React.useState<string>("");

  /**
   * Applica il filtro globale alla tabella con un ritardo di 500ms per evitare chiamate eccessive durante la digitazione.
   */
  const handleGlobalFilterChange = useDebounceFn(() => {
    table.setGlobalFilter(value);
  }, 500);

  /**
   * Gestisce il cambiamento del valore del filtro globale.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event - L'evento generato dal cambiamento del valore dell'input.
   */
  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    handleGlobalFilterChange();
  };

  return (
    <div className="absolute right-0 top-0 z-10 w-64 -translate-x-4 -translate-y-24 space-y-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-neutral-950 shadow-md outline-none">
      <Label>Filtro globale</Label>
      <Input onChange={handleValueChange} placeholder="Filtro globale" />
      <Button
        size="icon"
        variant="icon"
        className="absolute -top-2 right-0 size-6 hover:cursor-pointer"
        onClick={() => table.setGlobalFilter(table.getState().globalFilter !== undefined ? undefined : "")}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
}

export default DataTableGlobalFilter;
