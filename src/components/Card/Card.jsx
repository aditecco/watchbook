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

  return (
    <a href={null} className="CardAnchor">
      <article className="Card">
        <section className="CardMedia" style={{ padding: 0 }}>
          <img src={image} alt={title} className="CardPoster" />
        </section>

        <section className="CardBody">
          <header className="CardHeader">
            <h4 className="CardHeading">{title}</h4>
          </header>
          <span className="CardContent">{year + ", " + type}</span>
        </section>
        <footer className="CardFooter">
          {/* <div className="CardTimeStamp">
            <time>{new Date().toLocaleDateString()}</time>
          </div> */}
          <div className="CardControls">
            <ul className="CardControlsContainer">
              <li className="CardControlsItem CardControlsItem__to-watch">
                <button className="CardControlsItemButton" type="button">
                  To watch
                </button>
              </li>
              <li className="CardControlsItem CardControlsItem__watched">
                <button
                  className="CardControlsItemButton"
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
