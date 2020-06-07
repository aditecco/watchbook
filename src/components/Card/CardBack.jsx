/* ---------------------------------
CardBack
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";

export default function CardBack({
  addNoteHandler,
  flipHandler,
  contentUpdateHandler,
  additionalData,
  added,
  title,
}) {
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
            Object.entries(additionalData).map(([key, val], i) => {
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
            <>
              <button
                className="BaseButton button--outline"
                onClick={contentUpdateHandler}
              >
                <MaterialIcon icon="sync" /> Update info
              </button>

              <button
                className="BaseButton button--outline"
                onClick={addNoteHandler}
              >
                <MaterialIcon icon="note_add" /> Add note
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
