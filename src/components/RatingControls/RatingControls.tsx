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
    const nid = Number(id);

    if (nid === 0) {
      setStarred({ [nid]: !starred[nid] });
      onRate && onRate(nid + 1);

      return;
    }

    if (starred[nid - 1] && !starred[nid + 1]) {
      setStarred({ ...starred, [nid]: !starred[nid] });
      onRate && onRate(nid + 1);

      return;
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
