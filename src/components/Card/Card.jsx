/* ---------------------------------
Card
--------------------------------- */

import React, { useState, useEffect } from "react";
import { log, normalize } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";
import CardControls from "./CardControls";
import {
  UI_LABELS,
  PRIMARY_DATASET_KEY,
  SECONDARY_DATASET_KEY,
} from "../../constants";
import { useSpring, animated, useTrail } from "react-spring";
import { useSelector, useDispatch } from "react-redux";
import { refreshCardData, setAuthState } from "../../redux/actions";

export default React.memo(function Card({
  added,
  additionalData,
  dataSet,
  image,
  onToWatchClick,
  onWatchedClick,
  title,
  type,
  year,
  ...other
}) {
  const [flipped, toggleFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { cardData } = useSelector(state => state.apiData);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  const _additionalData = additionalData ? normalize(additionalData) : {};

  /**
   * handlePrimaryAction
   */
  function handlePrimaryAction(e) {
    e.preventDefault();

    onWatchedClick({
      contentType: PRIMARY_DATASET_KEY,
      image,
      title,
      type,
      year,
      ..._additionalData,
    });
  }

  /**
   * handleSecondaryAction
   */

  function handleSecondaryAction(e) {
    e.preventDefault();

    onToWatchClick({
      contentType: SECONDARY_DATASET_KEY,
      image,
      title,
      type,
      year,
      ..._additionalData,
    });
  }

  useEffect(() => {
    cardData.updateSignal === additionalData.id && log("UPDATED ", title);
  }, [cardData]);

  return loading ? (
    "loading" // Card placeholder
  ) : (
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
                    : "N/A"}
                </li>

                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Director</h6>

                  {_additionalData.director || "N/A"}
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
              {!added ? (
                /**
                 * cards in the new item modal
                 */
                <CardControls
                  labels={UI_LABELS.cardControlsLabels(dataSet)}
                  icons={["check_circle", "bookmark"]}
                  handlers={[handlePrimaryAction, handleSecondaryAction]}
                  type={dataSet}
                />
              ) : dataSet === SECONDARY_DATASET_KEY ? (
                /**
                 * cards in the toWatch section
                 */
                <CardControls
                  labels={UI_LABELS.cardControlsLabels(dataSet)}
                  icons={["check_circle", "remove_circle"]}
                  handlers={[handlePrimaryAction, handleSecondaryAction]}
                  type={dataSet}
                />
              ) : // other cards
              null}
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

            <div className="CardBackControls">
              {added && (
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
                  <MaterialIcon icon="sync" /> Update info
                </button>
              )}
            </div>
          </div>
        </article>
      </animated.div>
    </div>
  );
});
