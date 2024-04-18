import React from "react";
import { ModeToggle } from "./mode-toggle";

function Navbar(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-1 text-primary">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shadstack Table</h1>
        <ModeToggle />
      </div>
      <div>
        <p className="text-sm text-secondary">
          {`Beautiful data table built with `}
          <a href="https://ui.shadcn.com/" className="font-bold italic hover:text-primary">
            Shadcn
          </a>
          {` and `}
          <a href="https://tanstack.com/table/" className="font-bold italic hover:text-primary">
            Tanstack Table v8.
          </a>
        </p>
        <p className="text-sm text-secondary">
          This data table was build with the purpose to be fast, lightweight and easy to use.
        </p>
        <p className="text-sm text-secondary">
          It has features like Row virtualization, Column sorting, filtering, ordering, pinning, etc.
        </p>
      </div>
    </div>
  );
}

export default Navbar;
