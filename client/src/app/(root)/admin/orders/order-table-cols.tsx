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
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/apis/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const orderTableColumns: ColumnDef<Order>[] = [
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
          #{orderId.slice(0, 8)}...
        </Link>
      );
    },
    size: 120,
  },
  {
    accessorKey: "customer",
    header: "Customer Details",
    cell: ({ row }) => {
      const customer = row.getValue("customer") as Order["customer"];
      return (
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.name}`}
              alt={customer.name}
            />
            <AvatarFallback>
              {customer.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{customer.name}</span>
            <span className="text-sm text-gray-500">{customer.email}</span>
            <span className="text-xs text-gray-400">
              {customer.phoneNumber}
            </span>
            {customer.address && (
              <div className="mt-1 text-xs">
                <p className="text-gray-500">
                  {customer.address.city}, {customer.address.state}
                </p>
                <p className="text-gray-400">
                  {customer.address.pincode}, {customer.address.country}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    },
    size: 250,
  },
  {
    accessorKey: "items",
    header: "Order Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as Order["items"];
      return (
        <div className="flex flex-col space-y-2">
          {items.map((item) => (
            <div key={item.title} className="flex items-start space-x-2">
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="rounded-md border object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-gray-500">
                  {item.category.replace("_", " ")} • {item.material}
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.sizes.map((size, i) => (
                    <span
                      key={i}
                      className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600"
                    >
                      {size.size}: {size.quantity}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium">
                ₹{(item.price * item.sizes.reduce((a, b) => a + b.quantity, 0)).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      );
    },
    size: 350,
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
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(total);
      return <span className="font-medium">{formatted}</span>;
    },
    size: 100,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Status <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];

      const statusVariants = {
        PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        PROCESSING: "bg-blue-100 text-blue-800 hover:bg-blue-200",
        SHIPPED: "bg-purple-100 text-purple-800 hover:bg-purple-200",
        DELIVERED: "bg-green-100 text-green-800 hover:bg-green-200",
        CANCELLED: "bg-red-100 text-red-800 hover:bg-red-200",
        RETURNED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      };

      return (
        <Badge className={cn("capitalize", statusVariants[status])}>
          {status.toLowerCase()}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Payment <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const paymentStatus = row.getValue("paymentStatus") as Order["paymentStatus"];

      const paymentVariants = {
        PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        COMPLETED: "bg-green-100 text-green-800 hover:bg-green-200",
        FAILED: "bg-red-100 text-red-800 hover:bg-red-200",
        REFUNDED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        PARTIALLY_REFUNDED: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
      };

      return (
        <Badge className={cn("capitalize", paymentVariants[paymentStatus])}>
          {paymentStatus.toLowerCase().replace("_", " ")}
        </Badge>
      );
    },
    size: 150,
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
        hour: "2-digit",
        minute: "2-digit",
      });
      return (
        <div className="flex flex-col">
          <span>{formatted.split(",")[0]}</span>
          <span className="text-xs text-gray-500">
            {formatted.split(",").slice(1).join(",").trim()}
          </span>
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "rozarPayOrderId",
    header: "Payment ID",
    cell: ({ row }) => {
      const paymentId = row.getValue("rozarPayOrderId") as string;
      return (
        <span className="text-sm font-mono text-gray-600">
          {paymentId.slice(0, 8)}...
        </span>
      );
    },
    size: 120,
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
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white" align="end">
            <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`/orders/${order.id}`}>View Full Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
              Copy Order ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.rozarPayOrderId)}>
              Copy Payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Print Invoice</DropdownMenuItem>
            <DropdownMenuItem>Send Notification</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Update Status</DropdownMenuItem>
            {order.status !== "CANCELLED" ? (
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                Cancel Order
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>Order Cancelled</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 80,
  },
];