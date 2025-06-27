"use client";
import React from "react";
import { Button } from "../ui/button";
import { Link } from "next-view-transitions";
import { ArrowLeft } from "lucide-react";

const BackButton = ({
  href = "/shop",
  title = "Back to Shop",
}: {
  href?: string;
  title?: string;
}) => {
  return (
    <Button asChild variant="ghost" className="my-5 gap-2 max-w-[200px] bg-green-200">
      <Link href={href}>
        <ArrowLeft className="h-4 w-4" />
        <span>{title}</span>
      </Link>
    </Button>
  );
};

export default BackButton;
