"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { filterOptions } from "@/constants/filter";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export default function ProductsFilter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="font-bold" >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[425px]">
          <DialogHeader className="hidden">
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <FilterContent />
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilterContent() {
  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <h3 className="mb-3 text-base font-medium">Categories</h3>
        <div className="space-y-2">
          {filterOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox id={option.id} />
              <Label
                htmlFor={option.id}
                className="cursor-pointer text-sm font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range Section */}
      <div>
        <h3 className="mb-3 text-base font-medium">Price Range</h3>
        <div className="space-y-2">
          {[
            { id: "under20", label: "Under $20" },
            { id: "20-50", label: "$20 - $50" },
            { id: "50-100", label: "$50 - $100" },
            { id: "over100", label: "Over $100" },
          ].map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox id={option.id} />
              <Label
                htmlFor={option.id}
                className="cursor-pointer text-sm font-normal"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button className="rounded-none"  variant="outline" size="sm">
          Reset
        </Button>
        <Button className="rounded-none text-black"  size="sm">Apply</Button>
      </div>
    </div>
  );
}
