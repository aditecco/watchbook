/* ---------------------------------
RatingControls
--------------------------------- */

import React, { ReactElement, useState } from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { log } from "../../utils";

interface OwnProps {
  initialRating?: number | undefined;
  maxRating?: number | undefined;
  onRate?: (arg0) => void;
}

export default function RatingControls({
  initialRating,
  maxRating = 5,
  onRate,
}: OwnProps): ReactElement {
  const [starred, setStarred] = useState(initRating(initialRating) || {});

  /**
   * initRating
   */

  function initRating(rating) {
    if (!rating) return undefined;

    let r = {};

    for (let i = 0; i <= maxRating; i++) {
      if (i <= rating - 1) {
        r[i] = true;
      }

      //
      else {
        r[i] = false;
      }
    }

    return r;
  }

  /**
   * handleRating
   */
  function handleRating(e: React.MouseEvent<HTMLButtonElement>) {
    const { id } = e.currentTarget;
    const currentStar = Number(id);

    if (!starred[currentStar + 1]) {
      let stars = {};

      for (let i = 0; i <= currentStar; i++) {
        if (!starred[currentStar]) {
          stars[i] = true;
        }

        //
        else {
          stars[i] = false;
        }
      }

      setStarred(stars);

      onRate &&
        onRate(Object.values(stars).every(star => !star) ? 0 : currentStar + 1);
    }
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
            data-starred={starred[String(i)]}
          >
            <MaterialIcon icon={starred[String(i)] ? "star" : "star_outline"} />
          </button>
        ))}
    </div>
  );
}
