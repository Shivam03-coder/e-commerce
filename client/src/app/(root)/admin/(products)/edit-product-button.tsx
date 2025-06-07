"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Pencil, Plus } from "lucide-react";
import ProductForm from "./add-prodcuts-form";
import { useState } from "react";
import type { EditProductProps } from "@/types/global";
import EditProductForm from "./edit-product-form";

function EditProductBtn({ products }: { products: EditProductProps }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-x-2 text-sm">
          <Pencil size={17} /> Edit Product
        </button>
      </SheetTrigger>
      <SheetContent className="h-full max-w-[580px] min-w-[500px] overflow-y-scroll rounded-2xl bg-white px-7 py-6">
        <SheetHeader className="mb-3 hidden">
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <EditProductForm products={products} onClose={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

export default EditProductBtn;
