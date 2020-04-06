/* ---------------------------------
CompactCardAnchor
--------------------------------- */

import React from "react";
import { log } from "../../utils";

export default function CompactCard({
  image,
  title,
  type,
  year,
  onToWatchClick,
  onWatchedClick,
  ...other
}) {
  // log(arguments);

  return (
    <div className="CompactCardContainer">
      <article className="CompactCard">
        <section className="CompactCardMedia" style={{ padding: 0 }}>
          <img src={image} alt={title} className="CompactCardPoster" />
        </section>

        <section className="CompactCardBody">
          <header className="CompactCardHeader">
            <h4 className="CompactCardHeading">{title}</h4>
          </header>
          <span className="CompactCardContent">{year + ", " + type}</span>
        </section>
      </article>
    </div>
  );
}
