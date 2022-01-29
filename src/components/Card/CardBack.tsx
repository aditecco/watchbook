/* ---------------------------------
CardBack
--------------------------------- */

import React, { ReactElement } from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { Tag } from "../../types";

interface OwnProps {
  noteHandler;
  tagHandler;
  flipHandler;
  contentUpdateHandler;
  additionalData;
  added;
  title;
}

export default function CardBack({
  noteHandler,
  tagHandler,
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
            ).map(([key, val]: readonly [any, any], i) => {
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

                  else if (key === "tags") {
                    val = (
                      <>
                        {((val as unknown) as Tag[])
                          .map((v: Tag) => v.value)
                          .join()}
                      </>
                    );
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
                onClick={noteHandler}
              >
                <MaterialIcon icon={hasNotes ? "notes" : "note_add"} />{" "}
                {hasNotes ? "Edit note" : "Add note"}
              </button>

              <button
                className="BaseButton button--outline"
                onClick={tagHandler}
              >
                <MaterialIcon icon={"local_offer"} /> Add tag
              </button>

              <a className={"LinkButton"} onClick={contentUpdateHandler}>
                <MaterialIcon icon="sync" /> Update info
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
