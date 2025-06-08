"use client";
import React, { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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



// Mock reviews data
const mockReviews = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      avatar: "/avatars/01.png",
      initials: "AJ",
    },
    rating: 5,
    comment:
      "Absolutely love these socks! The quality is amazing and they're so comfortable.",
    date: "2023-10-15",
  },
  {
    id: 2,
    user: {
      name: "Sam Wilson",
      avatar: "/avatars/02.png",
      initials: "SW",
    },
    rating: 4,
    comment: "Great design but runs a bit small. Would recommend sizing up.",
    date: "2023-09-28",
  },
];

const formSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  comment: z.string().min(10, "Review must be at least 10 characters"),
});

export default function ReviewSection({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState(mockReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newReview = {
        id: reviews.length + 1,
        user: {
          name: "You",
          avatar: "",
          initials: "Y",
        },
        rating: values.rating,
        comment: values.comment,
        date: new Date().toISOString().split("T")[0],
      };
      // @ts-ignore
      setReviews([...reviews, newReview]);
      form.reset();
      toast.success("Thank you for your review!");
    } catch (error) {
      console.error("Review submission error", error);
      toast.error("Failed to submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl py-8">
      <h2 className="mb-6 text-2xl font-bold">Customer Reviews</h2>

      {/* Existing Reviews */}
      <div className="mb-10 space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.avatar} />
                  <AvatarFallback>{review.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.user.name}</h3>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="my-2">
                    <StarRating value={review.rating} />
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
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
                  <FormLabel>Your Review</FormLabel>
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
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
