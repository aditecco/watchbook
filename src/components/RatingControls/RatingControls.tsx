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
    const nid = Number(id);

    onRate && onRate(nid); // TODO think about what to use it for

    // @ts-ignore
    setStarred(prevStarred => {
      if (nid === 0) return { [nid]: !prevStarred[nid] };

      if (prevStarred[nid - 1] && !prevStarred[nid + 1]) {
        return { ...prevStarred, [nid]: !prevStarred[nid] };
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
