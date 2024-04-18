import React from "react";
import { Header } from "@tanstack/react-table";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "../context-menu";

/**
 * Crea un menu contestuale per l'intestazione della tabella dei dati.
 *
 * @template TData Tipo dei dati della tabella.
 * @template TValue Tipo del valore dell'intestazione.
 * @param {Object} props Le proprietà del componente.
 * @param {Header<TData, TValue>} props.header L'intestazione della colonna della tabella.
 * @param {React.ReactNode} props.children I componenti figli.
 * @returns {React.JSX.Element} Il menu contestuale dell'intestazione della tabella.
 */
function DataTableHeaderContextMenu<TData, TValue>({
  header,
  children
}: {
  header: Header<TData, TValue>;
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {header.column.columnDef.header && (
          <ContextMenuLabel>{header.column.columnDef.header.toString()}</ContextMenuLabel>
        )}

        <ContextMenuSeparator />

        {(header.column.getFilterValue() as string) && (
          <ContextMenuItem onClick={() => header.column.setFilterValue(undefined)}>
            Resetta Filtro Colonna
          </ContextMenuItem>
        )}
        {header.column.getIsVisible() && (
          <ContextMenuItem onClick={() => header.column.toggleVisibility()}>Nascondi Colonna</ContextMenuItem>
        )}
        {header.column.getSize() !== header.column.columnDef.minSize && (
          <ContextMenuItem onClick={() => header.column.resetSize()}>Reimposta Dimensione Colonna</ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default DataTableHeaderContextMenu;
