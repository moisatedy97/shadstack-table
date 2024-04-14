import React, { RefObject, useImperativeHandle, useMemo, useRef, useState } from "react";
import { FilterFnOption, Header } from "@tanstack/react-table";
import { Filter, X } from "lucide-react";

import useDebounceFn from "@/hooks/useDebounceFn";

import { Button } from "../button";
import { Input } from "../input";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";

function TableHeadFiltering<TData, TValue>({ header }: { header: Header<TData, TValue> }): React.JSX.Element {
  const filterRef = useRef<{ value: string; updateRef: (operator: string) => void }>(null);
  const [value, setValue] = useState<string>((header.column.getFilterValue() as string) ?? "");

  const handleDataTableStateChange = useDebounceFn(() => {
    if (value.length > 0) {
      header.column.setFilterValue(value);
    } else {
      header.column.setFilterValue(undefined);
    }
  }, 500);

  const handleChangeFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    handleDataTableStateChange();
  };

  const handleClearFilter = () => {
    setValue("");
    handleDataTableStateChange();
  };

  const selectColumnFilter = useMemo(() => {
    return <SelectColumnFilter filterRef={filterRef} header={header} />;
  }, []);

  if (header.column.getCanFilter()) {
    return (
      <Popover>
        <PopoverTrigger asChild={true}>
          <Button variant={"ghost"} className="group mx-1 h-full px-2 hover:bg-secondary/10">
            <>
              <Filter
                className={`size-4 cursor-pointer ${header.column.getIsFiltered() ? "text-primary group-hover:text-primary/70" : "text-secondary/40"}`}
              />
              {header.column.getIsFiltered() && (
                <span className="bg-primary group-hover:bg-primary/70 absolute right-3 top-1 h-2 w-2 rounded-full" />
              )}
            </>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-96 items-center gap-2" side="top">
          {selectColumnFilter}
          <Input type="text" placeholder="Filter" value={value} onChange={handleChangeFilter} />
          <Button variant="destructive" disabled={value.length === 0} className="w-10 p-2" onClick={handleClearFilter}>
            <X />
          </Button>
        </PopoverContent>
      </Popover>
    );
  } else {
    return <React.Fragment />;
  }
}

export default TableHeadFiltering;

const SelectColumnFilter = <TData, TValue>({
  filterRef,
  header
}: {
  filterRef: RefObject<{ value: string; updateRef: (operator: string) => void }>;
  header: Header<TData, TValue>;
}) => {
  const selectRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(
    filterRef,
    () => ({
      ...filterRef.current!,
      updateRef(operator: string) {
        filterRef.current!.value = operator;
      }
    }),
    []
  );

  const handleValueChange = (operator: string) => {
    filterRef.current?.updateRef(operator);

    header.column.columnDef.filterFn = operator as FilterFnOption<TData>;
    header.getContext().table.setColumnFiltersFns((old) => {
      const aa = old.map((entry) => (entry.id === header.column.id ? { ...entry, filterFn: operator } : entry));
      if (!aa.find((entry) => entry.id === header.column.id)) {
        aa.push({ id: header.column.id, filterFn: operator });
      }
      console.log(aa);

      return aa;
    });
  };

  return (
    <div className="min-w-24">
      <Select onValueChange={handleValueChange} defaultValue={header.column.getFilterFn()?.name}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem ref={selectRef} value={"auto"}>
            {"auto"}
          </SelectItem>
          <SelectItem ref={selectRef} value={"equals"}>
            {"equals"}
          </SelectItem>
          <SelectItem ref={selectRef} value={"equalsString"}>
            {"equalsString"}
          </SelectItem>
          <SelectItem ref={selectRef} value={"includesString"}>
            {"includesString"}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
