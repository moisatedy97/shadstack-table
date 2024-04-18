import React from "react";
import { FilterFnOption, Header } from "@tanstack/react-table";
import { Filter } from "lucide-react";

import useDebounceFn from "@/hooks/useDebounceFn";
import { dataTableNumberFilters, dataTableStringFilters } from "@/lib/defaults/data-table-models";
import { FilterOption } from "@/lib/interfaces/data-table-states";

import { Button } from "../button";
import { Input } from "../input";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

function TableHeadFiltering<TData, TValue>({ header }: { header: Header<TData, TValue> }): React.JSX.Element {
  const filterValue = header.column.getFilterValue() as string;
  const filterOperator = header.getContext().table.getState().columnFiltersFns[header.column.id];
  const [value, setValue] = React.useState<string>(filterValue ?? "");

  const firstValue = React.useMemo(() => {
    return header.getContext().table.getPreFilteredRowModel().flatRows[0]?.getValue(header.column.id);
  }, [header.getContext().table.getPreFilteredRowModel().flatRows]);

  const handleDataTableStateChange = useDebounceFn(() => {
    if (typeof firstValue === "number") {
      if (value === "") {
        header.column.setFilterValue(undefined);
      } else {
        header.column.setFilterValue(Number(value));
      }
    } else {
      header.column.setFilterValue(value);
    }
  }, 500);

  const handleChangeFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof firstValue === "number") {
      if (!isNaN(Number(event.target.value))) {
        setValue(event.target.value);
        handleDataTableStateChange();
      }
    } else {
      setValue(event.target.value);
      handleDataTableStateChange();
    }
  };

  const handleClearFilter = () => {
    setValue("");
    handleDataTableStateChange();
  };

  const selectColumnFilter = React.useMemo(() => {
    return <SelectColumnFilter header={header} firstValue={firstValue} filterOperator={filterOperator} />;
  }, [firstValue]);

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button
          variant={"ghost"}
          disabled={!header.column.getCanFilter()}
          className="relative size-7 px-1 hover:bg-secondary/10"
        >
          <>
            <Filter
              className={`${header.column.getIsFiltered() ? "text-primary group-hover:text-primary/70" : "text-secondary/40"}`}
            />
            {header.column.getIsFiltered() && (
              <span className="absolute right-0 top-0.5 h-1.5 w-1.5 rounded-full bg-primary group-hover:bg-primary/70" />
            )}
          </>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="flex w-72 flex-col items-center gap-2">
        {filterOperator?.length === 0 ? <React.Fragment /> : selectColumnFilter}
        <Input placeholder="Filter" disabled={!filterOperator} value={value} onChange={handleChangeFilter} />
        <Button
          variant="destructive"
          disabled={!filterOperator || value === undefined}
          className="self-end"
          onClick={handleClearFilter}
        >
          Reset
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default TableHeadFiltering;

const SelectColumnFilter = <TData, TValue>({
  header,
  firstValue,
  filterOperator,
}: {
  header: Header<TData, TValue>;
  firstValue: TValue;
  filterOperator: FilterOption;
}) => {
  const dataTableFilters = typeof firstValue === "number" ? dataTableNumberFilters : dataTableStringFilters;

  const handleValueChange = (operator: string) => {
    header.column.columnDef.filterFn = operator as FilterFnOption<TData>;
    header.column.setFilterValue(header.column.getFilterValue() as string);

    header.getContext().table.setColumnFiltersFns((old) => {
      return { ...old, [header.column.id]: operator };
    });
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleValueChange} defaultValue={filterOperator}>
        <SelectTrigger>
          <SelectValue placeholder="Select a filter" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(dataTableFilters).map((key, index) => (
            <SelectItem key={`${index}_${key}`} value={key}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
