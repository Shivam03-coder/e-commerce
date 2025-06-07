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
import { Plus } from "lucide-react";
import ProductForm from "./add-prodcuts-form";
import { useState } from "react";

function AddProductsBtn() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size={"sm"} variant="default">
          <Plus /> Add Product
        </Button>
      </SheetTrigger>
      <SheetContent className="h-full max-w-[580px] min-w-[500px] overflow-y-scroll bg-white px-7 py-6">
        <SheetHeader className="mb-3 hidden">
          <SheetTitle>Create Product</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <ProductForm onClose={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

export default AddProductsBtn;
