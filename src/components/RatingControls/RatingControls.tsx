/* ---------------------------------
RatingControls
--------------------------------- */

import React, { ReactElement, useState } from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { log } from "../../utils";

interface OwnProps {
  maxRating?: number;
  onRate?: (arg0) => void;
}

export default function RatingControls({
  maxRating = 5,
  onRate,
}: OwnProps): ReactElement {
  const [starred, setStarred] = useState({});

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
