"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface CustomerType {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  userAddress: {
    city: string;
    state: string;
  };
}

export const customerTableColumns: ColumnDef<CustomerType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="mx-5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    accessorKey: "id",
    header: "User-Id",
    cell: ({ row }) => {
      const userid = row.original.id;
      return (
        <span className="rounded bg-green-200 p-1 text-black">{userid}</span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Customer Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const customerId = row.original.id;

      return (
        <Link
          href={`/customers/${customerId}`}
          className="hover:text-dark rounded-2xl bg-blue-200 p-2 text-black uppercase transition"
        >
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Email <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Phone Number <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "userAddress.city",
    header: "City",
    cell: ({ row }) => {
      // @ts-ignore
      const city = row.original.userAddress[0]?.city;
      return <span>{city || "-"}</span>;
    },
  },
  {
    accessorKey: "userAddress.state",
    header: "State",
    cell: ({ row }) => {
      // @ts-ignore
      const state = row.original.userAddress[0]?.state;
      return <span>{state || "-"}</span>;
    },
  },
];
