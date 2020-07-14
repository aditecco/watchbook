/* ---------------------------------
Card
--------------------------------- */

import React, { useState, useEffect, ReactElement } from "react";
import { log, normalize, clipText } from "../../utils";
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
import Spinner from "../Spinner/Spinner";
import { RootState } from "../../store";
import RatingControls from "../RatingControls/RatingControls";

// TODO
interface OwnProps {
  added;
  additionalData;
  dataSet;
  image;
  onToWatchClick?;
  onWatchedClick?;
  title;
  type;
  year;
}

export default React.memo(function Card(props: OwnProps): ReactElement {
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
  const { cardData } = useSelector((state: RootState) => state.apiData);

  const { transform, opacity } = useSpring({
    opacity: flipped ? 1 : 0,
    transform: `perspective(600px) rotateY(${flipped ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  // const _additionalData = additionalData ? normalize(additionalData) : {};
  const _additionalData = normalize(additionalData);

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
        // TODO
        // @ts-ignore
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
        // TODO
        // @ts-ignore
        key: _additionalData.key,
        title,
      })
    );
  }

  /**
   * createNote
   */

  function createNote(note) {
    dispatch(
      actions.createNote({
        note,
        // TODO
        // @ts-ignore
        contentRef: _additionalData.key,
        title,
      })
    );
  }

  /**
   * deleteNote
   */

  function deleteNote() {
    createNote(null);
  }

  /**
   * createRating
   */

  function createRating(rating) {
    dispatch(
      actions.createRating({
        rating,
        title,
        // TODO
        // @ts-ignore
        contentRef: _additionalData.key,
      })
    );
  }

  //
  useEffect(() => {
    cardData.updateSignal === additionalData.id && log("UPDATED ", title);
  }, [cardData]);

  return loading ? (
    <Spinner />
  ) : (
    <div className="CardContainer">
      <animated.div
        className="CardAnimatedFrame"
        style={{
          position: "absolute",
          zIndex: !flipped ? 1 : "auto",
          // TODO
          // @ts-ignore
          opacity: opacity.interpolate(o => 1 - o),
          transform,
        }}
      >
        <article
          className={`Card front${added ? " added" : ""}${
            dataSet === SECONDARY_DATASET_KEY ? " toWatch" : ""
          }`}
        >
          <RatingControls
            // @ts-ignore
            initialRating={_additionalData.ratings}
            onRate={createRating}
          />

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

                  {// TODO
                  // @ts-ignore
                  // prettier-ignore
                  (_additionalData.country && clipText(_additionalData.country)) ||
                    "N/A"}
                </li>

                <li className="CardMetaItem">
                  <h6 className="CardMetaItemTitle">Director</h6>

                  {// TODO
                  // @ts-ignore
                  // prettier-ignore
                  (_additionalData.director && clipText(_additionalData.director)) ||
                    "N/A"}
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
          noteHandler={() =>
            dispatch(
              actions.toggleModal({
                content: (
                  <Note
                    // TODO
                    // @ts-ignore
                    cardId={_additionalData.key}
                    // TODO
                    // @ts-ignore
                    content={_additionalData.notes}
                    itemTitle={title}
                    actions={
                      // TODO
                      // @ts-ignore
                      _additionalData.notes
                        ? [
                            // note exists, edit mode
                            {
                              type: "delete",
                              label: "Delete",
                              handler: deleteNote,
                              icon: "delete",
                            },
                            {
                              type: "create",
                              label: "Save",
                              handler: createNote,
                              icon: "save",
                            },
                          ]
                        : [
                            // no note, create mode
                            {
                              type: "discard",
                              label: "Discard",
                              handler: () => {
                                dispatch(actions.toggleModal());
                              },
                              icon: "clear",
                            },
                            {
                              type: "create",
                              label: "Save",
                              handler: createNote,
                              icon: "save",
                            },
                          ]
                    }
                  />
                ),
              })
            )
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
