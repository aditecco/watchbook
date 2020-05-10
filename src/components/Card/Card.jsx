/* ---------------------------------
Card
--------------------------------- */

import React, { useState } from "react";
import { log, normalize } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";
import { useSpring, animated } from "react-spring";
import { useDispatch } from "react-redux";
import { refreshCardData } from "../../redux/actions";

export default function Card({
  image,
  title,
  type,
  year,
  onToWatchClick,
  onWatchedClick,
  added,
  additionalData,
  ...other
}) {
  const [flipped, toggleFlipped] = useState(false);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const dispatch = useDispatch();
  const _additionalData = additionalData ? normalize(additionalData) : {};

  return (
    <div className="CardContainer">
      <animated.div
        className="CardAnimatedFrame"
        style={{
          position: "absolute",
          zIndex: !flipped ? 1 : "auto",
          opacity: opacity.interpolate(o => 1 - o),
          transform,
        }}
      >
        <article className={`Card front${added ? " added" : ""}`}>
          <div className="CardFlipControls">
            <div
              className="CardFlipAreaButton"
              onClick={() => toggleFlipped(!flipped)}
            >
              <MaterialIcon icon="info" />
            </div>
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
                  <h6 className="CardMetaItemTitle">Country</h6>

                  {_additionalData.country
                    ? _additionalData.country.length > 15
                      ? _additionalData.country.substring(0, 10) + "…"
                      : _additionalData.country
                    : "n/a"}
                </li>

                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Director</h6>

                  {_additionalData.director || "n/a"}
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
                  {/* TO WATCH */}
                  <button
                    className="CardControlsButton"
                    type="button"
                    onClick={e => {
                      e.preventDefault();

                      onToWatchClick({
                        contentType: "toWatch",
                        image,
                        title,
                        type,
                        year,
                        ..._additionalData,
                      });
                    }}
                  >
                    To Watch <i className="material-icons">bookmark</i>
                  </button>

                  {/* WATCHED */}
                  <button
                    className="CardControlsButton"
                    type="button"
                    onClick={e => {
                      e.preventDefault();

                      onWatchedClick({
                        contentType: "watched",
                        image,
                        title,
                        type,
                        year,
                        ..._additionalData,
                      });
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
        className="CardAnimatedFrame"
        style={{
          position: "absolute",
          opacity,
          transform: transform.interpolate(t => `${t} rotateY(180deg)`),
        }}
      >
        <article className="Card back">
          <div className="CardFlipControls">
            <button onClick={() => toggleFlipped(!flipped)}>
              <MaterialIcon icon="close" />
            </button>
          </div>

          <div className="CardBackContent">
            <header className="CardBackContentHeader">
              <h4 className="CardBackContentHeaderTitle">{title}</h4>
            </header>

            <ul className="CardBackDataList">
              {Object.keys(_additionalData).length &&
                Object.entries(_additionalData).map(([key, val], i) => {
                  // prettier-ignore

                  // TODO
                  // we don't manage these keys for now
                  if ([
                      'ratings',
                      'id',
                      'response',
                      'dvd',
                      'website',
                      'key',
                    ].includes(key))
                  {
                    return;
                  }

                  else if (key === "timestamp" || key === 'updatetimestamp')
                  {
                    key = key === "timestamp" ? "Date Added" : "Date Updated";
                    val = new Date(val).toLocaleDateString()
                  }

                  else if (key === 'poster')
                  {
                    val = (
                    <a href={val}>
                      <span>&rarr;</span>
                      <span>link</span>
                    </a>
                    )
                  }

                  return (
                    <li key={i} className="CardBackDataListItem">
                      <span className="DataKey">{key}</span>

                      {val}
                    </li>
                  );
                })}
            </ul>

            <button
              className="BaseButton button--outline"
              onClick={() =>
                dispatch(
                  refreshCardData({
                    title,
                    type,
                    year,
                    ..._additionalData,
                  })
                )
              }
            >
              re-fetch
            </button>
          </div>
        </article>
      </animated.div>
    </div>
  );
}
