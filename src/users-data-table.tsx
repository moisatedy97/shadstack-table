import { useQuery } from "@tanstack/react-query";
import React from "react";
import { User, usersData } from "./assets/users-data";
import DataTable from "./components/ui/data-table";
import { usersDataColumns } from "./users-data-table-columns";

const getUsersData = async () => {
  return usersData;
};

function UsersDataTable(): React.JSX.Element {
  const [clickedRow, setClickedRow] = React.useState<User | undefined>();
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await getUsersData();

      return response;
    },
    retry: 1,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (data) {
    return (
      <div className="flex flex-col gap-2 overflow-hidden">
        <div className={`flex gap-2 ${clickedRow ? "flex-col" : "flex-row"}`}>
          <span>Row clicked: </span>
          <div>{clickedRow ? <span>{JSON.stringify(clickedRow, null, 2)}</span> : <span>None</span>}</div>
        </div>
        <DataTable
          columns={usersDataColumns}
          data={data}
          isLoading={isLoading}
          onRowClick={(row) => setClickedRow(row.original)}
        />
      </div>
    );
  } else {
    return <div>No data</div>;
  }
}

export default UsersDataTable;
