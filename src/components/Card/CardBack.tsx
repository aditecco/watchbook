/* ---------------------------------
CardBack
--------------------------------- */

import React, { ReactElement } from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { log } from "../../utils";

interface OwnProps {
  noteHandler;
  flipHandler;
  contentUpdateHandler;
  additionalData;
  added;
  title;
}

export default function CardBack({
  noteHandler,
  flipHandler,
  contentUpdateHandler,
  additionalData,
  added,
  title,
}: OwnProps): ReactElement {
  const hasNotes = additionalData.notes;
  const orderedKeys = {
    director: "",
    plot: "",
    actors: "",
    writer: "",
    genre: "",
    runtime: "",
    year: "",
    released: "",
    language: "",
    country: "",
    awards: "",
    boxoffice: "",
  };

  return (
    <article className="Card back">
      <div className="CardFlipControls">
        <button onClick={flipHandler}>
          <MaterialIcon icon="close" />
        </button>
      </div>

      <div className="CardBackContent">
        <header className="CardBackContentHeader">
          <h4 className="CardBackContentHeaderTitle">{title}</h4>
        </header>

        <ul className="CardBackDataList">
          {Object.keys(additionalData).length &&
            Object.entries(
              // we build an object with enforced key order
              Object.entries(additionalData).reduce((acc, [k, val]) => {
                acc[k] = val;
                return acc;
              }, orderedKeys)
            ).map(([key, val], i) => {
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
                    'imdbrating',
                    'imdbvotes',
                    'metascore'
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
                    // TODO
                    // @ts-ignore
                    val = (
                    <a href={val}>
                      <span>&rarr;</span>
                      <span>link</span>
                    </a>
                    )
                  }

                  else if (key === 'notes')
                  {
                    if (!val) return;
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
            <>
              <button
                className="BaseButton button--outline"
                onClick={contentUpdateHandler}
              >
                <MaterialIcon icon="sync" /> Update info
              </button>

              <button
                className="BaseButton button--outline"
                onClick={noteHandler}
              >
                <MaterialIcon icon={hasNotes ? "notes" : "note_add"} />{" "}
                {hasNotes ? "Edit note" : "Add note"}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
