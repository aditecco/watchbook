/* ---------------------------------
Card
--------------------------------- */

import React, { useState } from "react";
import { log } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";
import { useSpring, animated } from "react-spring";

export default function Card({
  image,
  title,
  type,
  year,
  onToWatchClick,
  onWatchedClick,
  added,
  ...other
}) {
  // log(arguments);
  const [flipped, toggleFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 }
  });

  return (
    <>
      <animated.div
        style={{
          position: "absolute",
          zIndex: !flipped ? 1 : "auto",
          opacity: opacity.interpolate(o => 1 - o),
          transform
        }}
      >
        <article className={`Card front${added ? " added" : ""}`}>
          <div className="CardFlipControls">
            <button onClick={() => toggleFlipped(!flipped)}>
              <MaterialIcon icon="info" />
            </button>
          </div>

          <section className="CardMedia">
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
              {/* TODO maybe find a better prop name */}
              {!added && (
                <>
                  <button
                    className="CardControlsButton"
                    type="button"
                    onClick={e => {
                      e.preventDefault();

                      onToWatchClick({ image, title, type, year });
                    }}
                  >
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
              )}
            </div>
          </footer>
        </article>
      </animated.div>

      {/* back of the card */}
      <animated.div
        style={{
          position: "absolute",
          opacity,
          transform: transform.interpolate(t => `${t} rotateY(180deg)`)
        }}
      >
        <article className="Card back">
          <div className="CardFlipControls">
            <button onClick={() => toggleFlipped(!flipped)}>
              <MaterialIcon icon="close" />
            </button>
          </div>
          back of the card
        </article>
      </animated.div>
    </>
  );
}
