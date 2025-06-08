"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useUpdateProductsMutation } from "@/apis/admin-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import Spinner from "@/components/global/spinner";
import type { EditProductProps } from "@/types/global";
import { X } from "lucide-react"; // Import the X icon for delete button
import Image from "next/image";

export default function EditProductForm({
  onClose,
  products,
}: {
  onClose: (v: boolean) => void;
  products: EditProductProps;
}) {
  const [updateProduct, { isLoading }] = useUpdateProductsMutation();
  const [productImage, setProductImage] = useState<string>(
    products.productImage || "",
  );
  const form = useForm<AddProductSchemaType>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      title: products.title,
      tags: JSON.parse(products.tags as string),
      category: products.category,
      description: products.description,
      inStock: products.inStock,
      inventory: products.inventory.toString(),
      material: products.material,
      price: products.price.toString(),
      productImage: products.productImage,
      salePrice: products.salePrice.toString(),
      size: products.size,
    },
  });

  const { ErrorToast, SuccessToast } = useAppToasts();

  const handleDeleteImage = () => {
    setProductImage("");
    form.setValue("productImage", "");
  };

  async function onSubmit(values: AddProductSchemaType) {
    console.log("🚀 ~ onSubmit ~ values:", values);
    try {
      const res = await updateProduct({
        product: values,
        productId: parseInt(products.id),
      }).unwrap();
      if (res.status === "success") {
        SuccessToast({ title: "Product updated successfully" });
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
              <FormControl>
                {productImage ? (
                  <div className="relative">
                    <div className="center mx-auto h-full w-full">
                      <Image
                        src={productImage}
                        alt="Product image"
                        width={300}
                        height={400}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleDeleteImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <UploadProductImage
                    setfileUrl={(url: string) => {
                      setProductImage(url);
                      form.setValue("productImage", url);
                    }}
                  />
                )}
              </FormControl>
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
          {isLoading ? <Spinner /> : "UPDATE"}
        </Button>
      </form>
    </Form>
  );
}
