/* ---------------------------------
RatingControls
--------------------------------- */

import React, { ReactElement, useState } from "react";
import MaterialIcon from "../Misc/MaterialIcon";

interface OwnProps {
  maxRating?: number;
  onRate?: (arg0) => void;
}

export default function RatingControls({
  maxRating = 5,
  onRate,
}: OwnProps): ReactElement {
  const [starred, setStarred] = useState([]);

  /**
   * handleRating
   */
  function handleRating(e: React.MouseEvent<HTMLButtonElement>) {
    const { id } = e.currentTarget;
    onRate && onRate(id); // TODO think about what to use it for

    // @ts-ignore
    setStarred(prevStarred => {
      if (id === "0") return { [id]: !prevStarred[id] };

      if (prevStarred[Number(id) - 1] && !prevStarred[Number(id) + 1]) {
        return { ...prevStarred, [id]: !prevStarred[id] };
      }

      return prevStarred;
    });
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
