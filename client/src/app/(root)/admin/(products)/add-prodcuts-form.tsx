"use client";
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
      sizeStock: [],
    },
  });

  const { ErrorToast, SuccessToast } = useAppToasts();

  async function onSubmit(values: AddProductSchemaType) {
    console.log("🚀 ~ onSubmit ~ values:", values);
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
          name="sizeStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size & Stock</FormLabel>
              <FormControl>
                <div className="space-y-2">
                  {field.value?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-muted flex w-fit items-center justify-between gap-2 rounded-full border px-4 py-1"
                    >
                      <span className="font-medium">{item.size}</span>

                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const updated = [...field.value];
                            if (updated[index]!.stock > 0) {
                              updated[index]!.stock -= 1;
                              field.onChange(updated);
                            }
                          }}
                        >
                          -
                        </Button>

                        <Input
                          type="number"
                          className="h-6 w-12 px-1 py-0 text-center"
                          value={item.stock}
                          min={0}
                          onChange={(e) => {
                            const updated = [...field.value];
                            updated[index]!.stock = Number(e.target.value);
                            field.onChange(updated);
                          }}
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => {
                            const updated = [...field.value];
                            updated[index]!.stock += 1;
                            field.onChange(updated);
                          }}
                        >
                          +
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => {
                          const updated = field.value.filter(
                            (_, i) => i !== index,
                          );
                          field.onChange(updated);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}

                  {/* Add Size Dropdown */}
                  <Select
                    onValueChange={(val) => {
                      if (!field.value?.some((i) => i.size === val)) {
                        field.onChange([
                          ...field.value,
                          { size: val, stock: 0 },
                        ]);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_SIZE">ONE-SIZE</SelectItem>
                      <SelectItem value="XS_S">XS-S</SelectItem>
                      <SelectItem value="S_M">SM</SelectItem>
                      <SelectItem value="M_L">ML</SelectItem>
                      <SelectItem value="L_XL">LXL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </FormControl>
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
