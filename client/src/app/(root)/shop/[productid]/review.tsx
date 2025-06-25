"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import StarRating from "./star-rating";
import { useAddReviewMutation, useGetReviewQuery } from "@/apis/shop-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import Spinner from "@/components/global/spinner";

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export default function ReviewSection({ productId }: { productId: number }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const { data: reviewsData, isLoading } = useGetReviewQuery({ productId });
  const { SuccessToast, ErrorToast } = useAppToasts();
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await addReview({
      productId,
      message: values.comment,
      stars: values.rating,
    }).unwrap();

    if (res.status === "success") {
      SuccessToast({
        title: "Thank you for your review!",
      });
      form.reset();
    }
  }

  return (
    <div className="mx-auto max-w-6xl py-8">
      <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>
      {/* Existing Reviews */}
      <div className="mb-10 space-y-6">
        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviewsData?.result?.length! > 0 ? (
          reviewsData?.result.map((review) => (
            <div key={review.message} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {review.user.name
                      ?.split(" ")
                      .map((s: string) => s[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.user.name}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="my-2">
                    <StarRating value={review.stars} />
                  </div>
                  <p className="text-gray-700">{review.message}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No reviews yet. Be the first to review!
          </p>
        )}
      </div>

      {/* Add Review Form */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-medium">Write a Review</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <StarRating value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Share your thoughts about this product..."
                      rows={4}
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : "Submit Review"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
