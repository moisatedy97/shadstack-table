import React from "react";
import { ModeToggle } from "./mode-toggle";

function Navbar(): React.JSX.Element {
  return (
    <div className="flex justify-end">
      <ModeToggle />
    </div>
  );
}

export default Navbar;
