/* ---------------------------------
Card
--------------------------------- */

import React, { useState, useEffect } from "react";
import { log, normalize } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";
import CardControls from "./CardControls";
import CardBack from "./CardBack";
import Note from "../Note/Note";
import {
  UI_LABELS,
  PRIMARY_DATASET_KEY,
  SECONDARY_DATASET_KEY,
} from "../../constants";
import { useSpring, animated, useTrail } from "react-spring";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../redux/actions";

export default React.memo(function Card(props) {
  const {
    added,
    additionalData,
    dataSet,
    image,
    onToWatchClick,
    onWatchedClick,
    title,
    type,
    year,
  } = props;
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
   * createWatched
   */

  function createWatched(e) {
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
   * createToWatch
   */

  function createToWatch(e) {
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

  /**
   * deleteToWatch
   */

  function deleteToWatch() {
    dispatch(
      actions.deleteContent({
        contentType: SECONDARY_DATASET_KEY, // only toWatch content can be deleted, for now
        key: _additionalData.key,
        title,
      })
    );
  }

  /**
   * createWatchedFromToWatch
   *
   * - remove toWatch status from user profile
   * - add watched status to user profile
   * - (leave content item untouched)
   */

  function createWatchedFromToWatch() {
    dispatch(
      actions.convertContent({
        from: SECONDARY_DATASET_KEY,
        to: PRIMARY_DATASET_KEY,
        key: _additionalData.key,
        title,
      })
    );
  }

  //
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
        <article
          className={`Card front${added ? " added" : ""}${
            dataSet === SECONDARY_DATASET_KEY ? " toWatch" : ""
          }`}
        >
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
                  handlers={[createWatched, createToWatch]}
                  type={dataSet}
                />
              ) : dataSet === SECONDARY_DATASET_KEY ? (
                /**
                 * cards in the toWatch section
                 */
                <CardControls
                  labels={UI_LABELS.cardControlsLabels(dataSet)}
                  icons={["check_circle", "remove_circle"]}
                  handlers={[createWatchedFromToWatch, deleteToWatch]}
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
        <CardBack
          {...props}
          addNoteHandler={() =>
            dispatch(actions.toggleModal({ content: <Note /> }))
          }
          flipHandler={() => toggleFlipped(!flipped)}
          contentUpdateHandler={() =>
            dispatch(
              actions.refreshCardData({
                title,
                type,
                year,
                ..._additionalData,
              })
            )
          }
          additionalData={_additionalData}
        />
      </animated.div>
    </div>
  );
});
