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
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ProductsDataType } from "@/types/global";
import EditProductBtn from "./edit-product-button";

export const productTableColumns: ColumnDef<ProductsDataType>[] = [
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
    accessorKey: "title",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Product Name <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const productId = row.original.id;

      return (
        <Link
          href={`/products/${productId}`}
          className="hover:text-dark rounded-2xl bg-blue-200 p-2 text-black uppercase transition"
        >
          {title}
        </Link>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Category <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return <span>{category.split("_").join(" ")}</span>;
    },
  },
  {
    accessorKey: "material",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Material <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "sizeStocks",
    header: "Sizes & Stock",
    cell: ({ row }) => {
      const sizeStocks = row.original.sizeStocks;
      return (
        <div className="space-y-1">
          {sizeStocks.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-amber-400 px-2 py-1 text-xs">
                {item.size.split("_").join("-")}
              </span>
              <span className="text-sm">({item.stock})</span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Price <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(price);
      return <span>{formatted}</span>;
    },
  },
  {
    accessorKey: "salePrice",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Sale Price <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const salePrice = parseFloat(row.getValue("salePrice") || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(salePrice);
      return <span>{salePrice > 0 ? formatted : "-"}</span>;
    },
  },
  {
    accessorKey: "inStock",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        In Stock <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const inStock = row.getValue("inStock") as boolean;
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {inStock ? "Yes" : "No"}
        </span>
      );
    },
  },
  {
    accessorKey: "inventory",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        Inventory <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;

      const parseTags = (tags: string | string[]) => {
        if (Array.isArray(tags)) return tags;
        if (typeof tags === "string") {
          try {
            return JSON.parse(tags);
          } catch {
            return tags.split(",").map((tag) => tag.trim());
          }
        }
        return [];
      };
      const tags = parseTags(product.tags);

      const data = {
        id: product.id,
        title: product.title,
        description: product.description,
        category: product.category,
        productImage: product.productImage,
        material: product.material,
        sizeStocks: product.sizeStocks,
        tags: tags,
        price: product.price,
        salePrice: product.salePrice,
        inStock: product.inStock,
        inventory: product.inventory,
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white p-3" align="end">
            <DropdownMenuSeparator />
            <EditProductBtn products={data} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
