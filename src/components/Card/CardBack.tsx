/* ---------------------------------
CardBack
--------------------------------- */

import React, { ReactElement } from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

interface OwnProps {
  noteHandler: any;
  tagHandler: any;
  flipHandler: any;
  contentUpdateHandler: any;
  additionalData: any;
  added: boolean;
  title: string;
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
  // Enforce legacy field order
  const orderedKeys: { [key: string]: any } = {
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
              Object.entries(additionalData).reduce(
                (acc: Record<string, any>, [k, val]) => {
                  acc[k] = val;
                  return acc;
                },
                orderedKeys as Record<string, any>,
              ) as Record<string, any>,
            ).map(([key, val]: readonly [any, any], i) => {
              // skip unwanted keys
              if (
                [
                  "ratings",
                  "id",
                  "response",
                  "dvd",
                  "website",
                  "key",
                  "imdbrating",
                  "imdbvotes",
                  "metascore",
                ].includes(key)
              ) {
                return;
              }
              // handle timestamp fields
              else if (key === "timestamp" || key === "updatetimestamp") {
                key = key === "timestamp" ? "Date Added" : "Date Updated";
                val = new Date(val).toLocaleDateString();
              }
              // handle poster field
              else if (key === "poster") {
                val = (
                  <a href={val}>
                    <span>&rarr;</span>
                    <span>link</span>
                  </a>
                );
              }
              // skip notes if empty
              else if (key === "notes") {
                if (!val) return;
              }
              // handle tags
              else if (key === "tags") {
                val = Array.isArray(val) ? (
                  <>{val.map((tag: any) => tag.name).join(", ")}</>
                ) : null;
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
