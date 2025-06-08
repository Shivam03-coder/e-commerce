"use client";
import { useGetFeaturedProductQuery } from "@/apis/admin-api";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteFeaturedProductMutation } from "@/apis/admin-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FeaturedImagesList = () => {
  const { data, isLoading, isError } = useGetFeaturedProductQuery();
  const [deleteFeaturedProduct] = useDeleteFeaturedProductMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [posterToDelete, setPosterToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setPosterToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!posterToDelete) return;
    
    try {
      const res = await deleteFeaturedProduct({
        id: posterToDelete,
      }).unwrap();
      if (res.status === "success") {
        SuccessToast({ title: "Featured poster deleted successfully" });
      }
    } catch (error) {
      ErrorToast({
        title: "Failed to delete featured poster",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPosterToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-red-500">Failed to load featured posters</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {data?.result?.length !== 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.result?.map((poster) => (
            <Card
              key={poster.id}
              className="group relative overflow-hidden border-none"
            >
              <CardContent className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={poster.featuredProductImage}
                    alt="Featured Poster"
                    fill
                    className="h-full w-full object-cover"
                    sizes="(max-width: 640px) 100vw,
                          (max-width: 768px) 50vw,
                          (max-width: 1024px) 33vw,
                          25vw"
                    priority={false}
                    quality={80}
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(poster.id)}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the featured poster.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FeaturedImagesList;