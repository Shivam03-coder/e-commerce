"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagsInput } from "@/components/ui/tags-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  addProductSchema,
  type AddProductSchemaType,
} from "@/schema/product.schema";
import UploadProductImage from "./upload-product-image";
import { useAddProductsMutation } from "@/apis/admin-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import Spinner from "@/components/global/spinner";
import type { EditProductProps } from "@/types/global";

export default function ProductForm({
  onClose,
}: {
  onClose: (v: boolean) => void;
}) {
  const [addProduct, { isLoading }] = useAddProductsMutation();
  const form = useForm<AddProductSchemaType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      tags: ["best"],
    },
  });

  const { ErrorToast, SuccessToast } = useAppToasts();

  async function onSubmit(values: AddProductSchemaType) {
    try {
      const res = await addProduct(values).unwrap();
      if (res.status === "success") {
        SuccessToast({ title: "Product added successfully" });
        form.reset();
        onClose(false);
      } else {
        ErrorToast({
          title: res.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error("Form submission error", error);
      ErrorToast({
        title: "Failed to submit the form. Please try again.",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-[540px] space-y-8 pb-5 text-sm"
      >
        <FormField
          control={form.control}
          name="productImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Image</FormLabel>
              <FormControl></FormControl>
              <UploadProductImage setfileUrl={form.setValue} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="NOKS SOCKS" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category ." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HALF_SOCKS">HALF SOCKS</SelectItem>
                  <SelectItem value="NO_SHOW_SOCKS">NO SHOW SOCKS</SelectItem>
                  <SelectItem value="ANKLE_SOCKS">ANKLE SOCKS</SelectItem>
                  <SelectItem value="CREW_SOCKS">CREW SOCKS</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="material"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Material</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a material ." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="COTTON">COTTON</SelectItem>
                  <SelectItem value="BAMBOO">BAMBOO</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ONE_SIZE">ONE SIZE</SelectItem>
                  <SelectItem value="XS_S">XS S</SelectItem>
                  <SelectItem value="S_M">SM</SelectItem>
                  <SelectItem value="M_L">ML</SelectItem>
                  <SelectItem value="L_XL">LXL</SelectItem>
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="0.00000" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="salePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Price</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="inventory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Inventory</FormLabel>
              <FormControl>
                <Input placeholder="0" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Enter your tags"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="inStock"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3">
              <FormControl>
                <Checkbox
                  // @ts-ignore
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Available in Stock</FormLabel>

                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isLoading ? <Spinner /> : "CREATE"}
        </Button>
      </form>
    </Form>
  );
}
