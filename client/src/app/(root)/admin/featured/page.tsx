import React from "react";
import FeaturedImagesForm from "./featured-images-form";
import FeaturedImagesList from "./featured-images-list";

const page = () => {
  return (
    <main className="root py-6 space-y-4">
      <div className="w-[10%]">
        <FeaturedImagesForm />
      </div>
      <FeaturedImagesList />
    </main>
  );
};

export default page;
