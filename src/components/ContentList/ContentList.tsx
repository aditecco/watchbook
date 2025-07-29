/* ---------------------------------
ContentList
--------------------------------- */

import React, { ReactElement } from "react";
import Card from "../Card/Card";
import CompactCard from "../CompactCard/CompactCard";
import Spinner from "../Spinner/Spinner";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import { UI_LABELS } from "../../constants";
import { Dataset } from "../../types";

// TODO
interface OwnProps {
  compact?;
  content;
  dataSet: Dataset;
  infiniteScroll?;
  limit: number;
  observerRef?;
  title: string;
}

export default function ContentList({
  compact,
  content,
  dataSet,
  infiniteScroll,
  limit,
  observerRef,
  title,
}: OwnProps): ReactElement {
  return (
    <section className="ContentList">
      {content && content.length > 0 ? (
        <>
          <header className="ContentListHeader">
            <div className="wrapper">
              <h3 className="ContentListHeaderTitle">{title}</h3>
            </div>
          </header>

          <div className="wrapper">
            <ul className="ContentListCards ContentListGrid">
              {content.slice(0, limit).map((item, i) => {
                const { image, title, type, year, id, key, ...rest } = item;
                const contentId = id || key; // Support both new and legacy data structures

                return !compact ? (
                  <li key={contentId} data-index={i} className="cardListItem">
                    <Card
                      added
                      dataSet={dataSet}
                      image={image}
                      title={title}
                      type={type}
                      year={year}
                      contentId={contentId}
                      additionalData={{ ...rest }}
                    />
                  </li>
                ) : (
                  <li key={contentId} data-index={i} className="cardListItem">
                    <CompactCard
                      dataSet={dataSet}
                      image={image}
                      title={title}
                      type={type}
                      year={year}
                      contentId={contentId}
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
          <div className="blankSlateContent">
            <div className="blankSlateIcon">
              <MaterialIcon
                icon={title.includes("Watch") ? "bookmark_border" : "movie"}
              />
            </div>
            <h3 className="blankSlateTitle">
              {title.includes("To Watch")
                ? "Nothing to watch yet"
                : title.includes("Watched")
                  ? "No watched items yet"
                  : "No items yet"}
            </h3>
            <p className="blankSlateDescription">
              {title.includes("To Watch")
                ? "Search for movies and TV shows to add them to your watchlist."
                : title.includes("Watched")
                  ? "Mark items as watched to see them here."
                  : "Add some content to get started."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
