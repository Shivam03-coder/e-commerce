"use client";
import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";

const MainLink = ({
  className,
  href,
  title,
}: {
  href: string;
  title: string;
  className: string;
}) => {
  return (
    <Link href={href} className={cn(className)}>
      {title}
    </Link>
  );
};

export default MainLink;