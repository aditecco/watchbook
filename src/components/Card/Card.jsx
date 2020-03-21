/* ---------------------------------
Card
--------------------------------- */

import React from "react";
import { log } from "../../utils";

export default function Card({
  image,
  title,
  type,
  year,
  onToWatchClick,
  onWatchedClick,
  ...other
}) {
  // log(arguments);
  const isWatched = false;

  return (
    <a href={null} className="CardAnchor">
      <article className="Card">
        <section className="CardMedia" style={{ padding: 0 }}>
          <div className="CardPosterCurtain">
            <h3 className="CardPosterCurtainTitle">{title}</h3>

            <ul className="CardMeta">
              <li className="CardMetaItem">
                <h6 className="CardMetaItemTitle">Year</h6>

                {year}
              </li>
              <li className="CardMetaItem">
                <h6 className="CardMetaItemTitle">Type</h6>

                {type}
              </li>
            </ul>
          </div>

          <img src={image} alt={title} className="CardPoster" />
        </section>

        {/* <section className="CardBody">
          <span className="CardContent">{year + ", " + type}</span>
        </section> */}

        <footer className="CardFooter">
          <div className="CardControls">
            {/* 
            TODO

            Define how CardControls will change
            when the item is set as watched
            */}

            {!isWatched ? (
              <>
                <button className="CardControlsButton" type="button">
                  To Watch
                </button>

                <button
                  className="CardControlsButton"
                  type="button"
                  onClick={e => {
                    e.preventDefault();

                    onWatchedClick({ image, title, type, year });
                  }}
                >
                  Watched <i className="material-icons">check_circle</i>
                </button>
              </>
            ) : null}
          </div>
        </footer>
      </article>
    </a>
  );
}
