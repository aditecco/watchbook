/* ---------------------------------
WatchedList
--------------------------------- */

import React from "react";
import Card from "../Card/Card";
import CompactCard from "../CompactCard/CompactCard";

export default function WatchedList({
  watched = [],
  limit = undefined,
  title,
  compact,
  loading
}) {
  return (
    <section className="watched">
      {watched && watched.length ? (
        <>
          <header className="watchedHeader">
            <h3 className="watchedHeaderTitle">
              {title}
              {/* <span> ({watched.length}) </span> */}
            </h3>
          </header>
          <ul className="cardList watchedList">
            {watched.slice(0, limit).map((item, i) => {
              const { image, title, type, year } = item;

              return !compact ? (
                <li key={i} className="CardContainer">
                  <Card
                    image={image}
                    title={title}
                    type={type}
                    year={year}
                    // TODO
                    onWatchedClick={e => null}
                    onToWatchClick={e => null}
                  />
                </li>
              ) : (
                <li key={i} className="CardContainer compact">
                  <CompactCard
                    image={image}
                    title={title}
                    type={type}
                    year={year}
                    // TODO
                    onWatchedClick={e => null}
                    onToWatchClick={e => null}
                  />
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <div className="blankSlate">
          <span>No watched items.</span>
        </div>
      )}
    </section>
  );
}
