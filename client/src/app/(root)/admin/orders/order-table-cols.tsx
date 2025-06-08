"use client";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import type {
  Customer,
  OrderStatus,
  OrdersType,
  PaymentStatus,
  Product,
} from "@/types/global";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const orderTableColumns: ColumnDef<OrdersType>[] = [
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
    header: "Order ID",
    cell: ({ row }) => {
      const orderId = row.getValue("id") as string;
      return (
        <Link
          href={`/orders/${orderId}`}
          className="font-medium text-blue-600 hover:underline"
        >
          #{orderId.slice(0, 8)}
        </Link>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => {
      const customer = row.getValue("customer") as Customer;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{customer.name}</span>
          <span className="text-sm text-gray-500">{customer.email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      const products = row.getValue("products") as Product[];
      return (
        <div className="flex -space-x-2">
          {products.slice(0, 4).map((product) => (
            <div key={product.id} className="relative h-10 w-10">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="rounded-full border border-white object-cover"
              />
            </div>
          ))}
          {products.length > 4 && (
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white bg-gray-100 text-xs font-medium">
              +{products.length - 4}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Total <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(total);
      return <span className="font-medium">{formatted}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as OrderStatus;

      const statusVariants = {
        PENDING: "bg-yellow-100 text-yellow-800",
        PROCESSING: "bg-blue-100 text-blue-800",
        SHIPPED: "bg-purple-100 text-purple-800",
        DELIVERED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        RETURNED: "bg-gray-100 text-gray-800",
      };

      return (
        <Badge className={`${statusVariants[status]} capitalize`}>
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Payment <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus") as PaymentStatus;

      const paymentVariants = {
        PENDING: "bg-yellow-100 text-yellow-800",
        COMPLETED: "bg-green-100 text-green-800",
        FAILED: "bg-red-100 text-red-800",
        REFUNDED: "bg-gray-100 text-gray-800",
        PARTIALLY_REFUNDED: "bg-indigo-100 text-indigo-800",
      };

      return (
        <Badge className={`${paymentVariants[paymentStatus]} capitalize`}>
          {paymentStatus.toLowerCase().replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return <span>{formatted}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white p-3" align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/orders/${order.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Print Invoice</DropdownMenuItem>
            <DropdownMenuItem>Update Status</DropdownMenuItem>
            {order.status !== "CANCELLED" && (
              <DropdownMenuItem className="text-red-600">
                Cancel Order
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
