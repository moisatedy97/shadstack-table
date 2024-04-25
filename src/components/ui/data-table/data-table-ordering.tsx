import React from "react";
import { DraggableAttributes } from "@dnd-kit/core/dist/hooks/useDraggable";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities/useSyntheticListeners";
import { GripVertical } from "lucide-react";

import { Button } from "../button";

function DataTableOrdering({
  attributes,
  listeners,
}: {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}): React.JSX.Element {
  return (
    <Button
      {...attributes}
      {...listeners}
      variant={"ghost"}
      className="size-7 cursor-grab px-1 hover:bg-primary/10 dark:hover:bg-primary/30"
    >
      <GripVertical className="text-secondary/40" />
    </Button>
  );
}

export default DataTableOrdering;
