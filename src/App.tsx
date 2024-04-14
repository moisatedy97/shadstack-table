import DataTable from "./components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import { usersDataColumns } from "./users-data-table-columns";
import { usersData } from "./assets/users-data";
import Prova from "./Prova";

const getUsersData = async () => {
  return usersData;
};

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("fetching data");

      const response = await getUsersData();

      console.log(response);

      return response;
    },
    retry: 1,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return (
      <main className="mx-6 my-24 flex h-screen flex-col overflow-hidden">
        <DataTable
          columns={usersDataColumns}
          data={data}
          isLoading={isLoading}
          onRowClick={(row) => console.log(row)}
        />
        <Prova />
      </main>
    );
  } else {
    return <div>No data</div>;
  }
}

export default App;
