/* ---------------------------------
WatchedList
--------------------------------- */

import React from "react";
import Card from "../Card/Card";
import CompactCard from "../CompactCard/CompactCard";
import Spinner from "../Spinner/Spinner";

export default function WatchedList({
  compact,
  infiniteScroll,
  limit = undefined,
  loading,
  title,
  watched = [],
}) {
  return (
    <section className="watched">
      {watched && watched.length ? (
        <>
          <header className="watchedHeader">
            <h3 className="watchedHeaderTitle">{title}</h3>
          </header>
          <ul className="cardList watchedList">
            {watched.slice(0, limit).map((item, i) => {
              const { image, title, type, year, ...rest } = item;

              return !compact ? (
                <li key={i} data-index={i} className="cardListItem">
                  <Card
                    added
                    image={image}
                    title={title}
                    type={type}
                    year={year}
                    additionalData={{ ...rest }}
                  />
                </li>
              ) : (
                <li key={i} data-index={i} className="cardListItem">
                  <CompactCard
                    image={image}
                    title={title}
                    type={type}
                    year={year}
                  />
                </li>
              );
            })}
          </ul>

          {/* TODO */}
          {/* {infiniteScroll && <Spinner />} */}
          {infiniteScroll ? (
            <div
              className="infiniteScrollLoader"
              style={{ display: "block", textAlign: "center", padding: "1rem" }}
            >
              Loading…
            </div>
          ) : (
            <span
              style={{ display: "block", textAlign: "center", padding: "1rem" }}
            >
              No more items to load.
            </span>
          )}
        </>
      ) : (
        <div className="blankSlate">
          <span>No watched items.</span>
        </div>
      )}
    </section>
  );
}
