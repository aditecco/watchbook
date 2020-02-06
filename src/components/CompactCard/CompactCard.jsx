/* ---------------------------------
CompactCardAnchor
--------------------------------- */

import React from "react";
import { log } from "../../utils";

export default function CompactCompactCard({
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
    <a href={null} className="CompactCardAnchor">
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
        <footer className="CompactCardFooter">
          {/* <div className="CompactCardTimeStamp">
            <time>{new Date().toLocaleDateString()}</time>
          </div> */}
          <div className="CompactCardControls">
            <ul className="CompactCardControlsContainer">
              <li className="CompactCardControlsItem CompactCardControlsItem__to-watch">
                <button className="CompactCardControlsItemButton" type="button">
                  To watch
                </button>
              </li>
              <li className="CompactCardControlsItem CompactCardControlsItem__watched">
                <button
                  className="CompactCardControlsItemButton"
                  type="button"
                  onClick={e => {
                    e.preventDefault();

                    onWatchedClick({ image, title, type, year });
                  }}
                >
                  Watched <i className="material-icons">check_circle</i>
                </button>
              </li>
            </ul>
          </div>
        </footer>
      </article>
    </a>
  );
}
