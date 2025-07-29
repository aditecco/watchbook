/* ---------------------------------
RatingControls
--------------------------------- */

import React, { ReactElement, useEffect, useState } from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

interface OwnProps {
  initialRating?: number | undefined;
  maxRating?: number | undefined;
  onRate?: (rating: number) => void;
}

export default function RatingControls({
  initialRating,
  maxRating = 5,
  onRate,
}: OwnProps): ReactElement {
  const [starred, setStarred] = useState<Record<number, boolean>>(
    initRating(initialRating) || {},
  );

  // Update starred state when initialRating prop changes
  useEffect(() => {
    setStarred(initRating(initialRating) || {});
  }, [initialRating, maxRating]);

  /**
   * initRating
   */
  function initRating(rating: number | undefined): Record<number, boolean> {
    if (!rating) return {};

    const r: Record<number, boolean> = {};

    for (let i = 0; i < maxRating; i++) {
      r[i] = i < rating;
    }

    return r;
  }

  /**
   * handleRating - Fixed logic to properly handle star clicking
   */
  function handleRating(e: React.MouseEvent<HTMLButtonElement>) {
    const { id } = e.currentTarget;
    const currentStar = Number(id);

    // Create new stars object
    const stars: Record<number, boolean> = {};
    let newRating = currentStar + 1;

    // If clicking on the last filled star, clear the rating
    if (starred[currentStar] && !starred[currentStar + 1]) {
      // Clear all stars
      for (let i = 0; i < maxRating; i++) {
        stars[i] = false;
      }
      newRating = 0;
    } else {
      // Set stars up to the clicked star
      for (let i = 0; i < maxRating; i++) {
        stars[i] = i <= currentStar;
      }
    }

    setStarred(stars);
    onRate && onRate(newRating);
  }

  return (
    <div className="RatingControls">
      {Array(maxRating)
        .fill("")
        .map((_, i) => (
          <button
            className="RatingControlsButton"
            key={i}
            id={String(i)}
            onClick={handleRating}
            data-starred={starred[i]}
          >
            <MaterialIcon icon={starred[i] ? "star" : "star_outline"} />
          </button>
        ))}
    </div>
  );
}
