import { Header } from "@tanstack/react-table";

import { Separator } from "../separator";

function DataTableResizing<TData, TValue>({ header }: { header: Header<TData, TValue> }): React.JSX.Element {
  let separatorColor = "";
  const isResizing = header.column.getIsResizing();

  if (header.column.getCanResize()) {
    if (isResizing) {
      separatorColor = "bg-primary cursor-col-resize";
    } else {
      separatorColor = "bg-primary/50";
    }
  } else {
    separatorColor = "bg-secondary/40 cursor-not-allowed";
  }

  return (
    <div className="flex items-center">
      <Separator
        onMouseDown={header.getResizeHandler()}
        onTouchStart={header.getResizeHandler()}
        className={`h-8 w-0.5 cursor-col-resize touch-none select-none ${separatorColor}`}
      />
    </div>
  );
}

export default DataTableResizing;
