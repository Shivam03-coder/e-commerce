"use client";
import React, { useEffect, useRef, useCallback } from "react";

interface InfiniteScrollProps {
  isLoading: boolean;
  hasMore: boolean;
  next: () => void;
  children: React.ReactNode;
  threshold?: number;
  root?: HTMLElement | null;
  rootMargin?: string;
}

const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  isLoading,
  hasMore,
  next,
  children,
  threshold = 0.5,
  root = null,
  rootMargin = "0px",
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target?.isIntersecting && !isLoading && hasMore) {
        next();
      }
    },
    [isLoading, hasMore, next]
  );

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver, {
      root,
      rootMargin,
      threshold,
    });

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }

    return () => observer.current?.disconnect();
  }, [handleObserver, threshold, root, rootMargin]);

  return (
    <>
      {children}
      <div ref={loaderRef} className="h-10 w-full" />
    </>
  );
};

export default InfiniteScroll;
