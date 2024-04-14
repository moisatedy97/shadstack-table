import { ColumnDef } from "@tanstack/react-table";
import { User } from "./assets/users-data";

export const usersDataColumns: ColumnDef<User>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Id",
    enableResizing: false,
    minSize: 250,
    filterFn: "equals",
  },
  {
    id: "first_name",
    accessorKey: "first_name",
    header: "First Name",
    enableResizing: true,
    minSize: 320,
    filterFn: "equals",
  },
  {
    id: "last_name",
    accessorKey: "last_name",
    header: "Last Name",
    enableResizing: true,
    minSize: 320,
    filterFn: "equalsString",
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    enableResizing: true,
    minSize: 250,
  },
  {
    id: "gender",
    accessorKey: "gender",
    header: "Gender",
    enableResizing: true,
    minSize: 250,
  },
  {
    id: "ip_address",
    accessorKey: "ip_address",
    header: "Ip Address",
    enableResizing: true,
    minSize: 250,
  },
  {
    id: "city",
    accessorKey: "city",
    header: "City",
    enableResizing: true,
    minSize: 250,
  },
  {
    id: "address",
    accessorKey: "address",
    header: "Address",
    enableResizing: true,
    minSize: 250,
  },
  {
    id: "country",
    accessorKey: "country",
    header: "Country",
    enableResizing: true,
    minSize: 250,
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Phone",
    enableResizing: true,
    minSize: 250,
  },
];
