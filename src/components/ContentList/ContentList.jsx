/* ---------------------------------
ContentList
--------------------------------- */

import React, { useEffect } from "react";
import Card from "../Card/Card";
import CompactCard from "../CompactCard/CompactCard";
import Spinner from "../Spinner/Spinner";
import { UI_LABELS } from "../../constants";

export default function ContentList({
  compact,
  content,
  dataSet,
  infiniteScroll,
  limit,
  loading,
  observerRef,
  title,
}) {
  return (
    <section className="ContentList">
      {content ? (
        <>
          <header className="ContentListHeader">
            <div className="wrapper">
              <h3 className="ContentListHeaderTitle">{title}</h3>
            </div>
          </header>

          <div className="wrapper">
            <ul className="ContentListCards ContentListGrid">
              {content.slice(0, limit).map((item, i) => {
                const { image, title, type, year, ...rest } = item;

                return !compact ? (
                  <li key={i} data-index={i} className="cardListItem">
                    <Card
                      added
                      dataSet={dataSet}
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
                      dataSet={dataSet}
                      image={image}
                      title={title}
                      type={type}
                      year={year}
                      additionalData={{ ...rest }}
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          {/* TODO */}
          {infiniteScroll ? (
            <div
              ref={observerRef}
              className="infiniteScrollLoader"
              style={{ display: "block", textAlign: "center", padding: "1rem" }}
            >
              {!(limit >= content.length) && (
                <Spinner
                  inline
                  styles={{ width: 40, height: 40, borderWidth: 5 }}
                />
              )}
            </div>
          ) : (
            <span
              style={{ display: "block", textAlign: "center", padding: "1rem" }}
            >
              {UI_LABELS.allLoaded}
            </span>
          )}
        </>
      ) : (
        <div className="blankSlate wrapper">
          <div className="blankSlateContent">No items.</div>
        </div>
      )}
    </section>
  );
}
