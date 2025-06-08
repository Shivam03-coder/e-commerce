"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  featuredProductSchema,
  type FeaturedProductSchemaType,
} from "@/schema/product.schema";
import React from "react";
import UploadFeaturedProductImage from "./uplaod-featured-images";
import { useCreateFeaturedProductMutation } from "@/apis/admin-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import Spinner from "@/components/global/spinner";

const FeaturedImagesForm = () => {
  const [open, setOpen] = React.useState(false);
  const form = useForm<FeaturedProductSchemaType>({
    resolver: zodResolver(featuredProductSchema),
    defaultValues: {
      featuredProductImage: "",
    },
  });
  const [createFeaturedProduct, { isLoading }] =
    useCreateFeaturedProductMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();

  async function onSubmit(values: FeaturedProductSchemaType) {
    try {
      const res = await createFeaturedProduct(values).unwrap();
      if (res.status === "success") {
        SuccessToast({ title: "Featured Product added successfully" });
        form.reset();
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <Plus className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add Featured Image
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Featured Product Image</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pb-5 text-sm"
          >
            <FormField
              control={form.control}
              name="featuredProductImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured Product Image</FormLabel>
                  <UploadFeaturedProductImage setfileUrl={form.setValue} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                size={"sm"}
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button size={"sm"} type="submit">
                {isLoading ? <Spinner /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FeaturedImagesForm;
