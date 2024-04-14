import { Filter, SortDesc } from "lucide-react";
import { Button } from "./components/ui/button";

function Prova() {
  return (
    <main className="mt-10 w-56 border">
      <div
        className="relative m-1 flex items-center rounded-md px-2 py-1 hover:bg-primary/10"
        onClick={() => console.log("click main")}
      >
        <div className="flex flex-1 justify-center gap-2">
          <span>Ciao</span>
          <SortDesc className="size-5" />
        </div>
        <Button
          variant={"ghost"}
          className="absolute right-1 size-6 px-1 hover:bg-secondary/10"
          onClick={(e) => {
            e.stopPropagation();
            console.log("filter");
          }}
        >
          <Filter className={`cursor-pointer`} />
        </Button>
      </div>
    </main>
  );
}

export default Prova;
