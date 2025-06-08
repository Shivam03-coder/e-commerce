import { cn } from "@/lib/utils";
import { useState } from "react";

// Custom Star Rating Component
const StarRating = ({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange?: (value: number) => void;
  className?: string;
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hoverValue || value);
        return (
          <button
            key={star}
            type="button"
            className={`text-2xl ${onChange ? "cursor-pointer" : "cursor-default"}`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => onChange && setHoverValue(star)}
            onMouseLeave={() => setHoverValue(null)}
            aria-label={`Rate ${star} out of 5`}
          >
            {isFilled ? (
              <span className="text-yellow-500">★</span>
            ) : (
              <span className="text-gray-300">☆</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating