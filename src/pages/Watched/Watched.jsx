/* ---------------------------------
Watched
--------------------------------- */

import React, { useState, useEffect } from "react";
import { log } from "../../utils";
import { useSelector } from "react-redux";
import FilterAndSort from "../../components/FilterAndSort/FilterAndSort";
import FilterAndSortProvider from "../../components/FilterAndSortProvider";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import ViewOptions from "../../components/ViewOptions/ViewOptions";
import WatchedList from "../../components/WatchedList/WatchedList";
import QuickSearch from "../../components/QuickSearch/QuickSearch";
import { UI_LABELS } from "../../constants";
import MaterialIcon from "../../components/Misc/MaterialIcon";

export default function Watched() {
  // global state
  const {
    user: { uid },
  } = useSelector(state => state.authentication);
  const userData = useSelector(state => state.userData);

  // local state
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [renderedItemsLimit, setRenderedItemsLimit] = useState(10);
  const [activeQuery, setActiveQuery] = useState("");

  // other
  const { watched } = userData[uid]; // watched items cache
  const getType = type => watched.filter(item => item.type === type).length;

  /**
   * The intersection observer callback
   */

  function handleObserver(entries, observer) {
    // log("intersecting…", entries, observer);

    setRenderedItemsLimit(limit => limit + 10);
  }

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);

    // observer init
    let observer = new IntersectionObserver(handleObserver, {
      root: null, // uses the viewport
      rootMargin: "0px",
      threshold: 0.25,
    });

    const target = document.querySelector(".infiniteScrollLoader");

    target && observer.observe(target);

    return () => target && observer.unobserve(target);
  }, []);

  return (
    <Layout rootClass="Watched" selected={2}>
      <PageHeader
        title="watched"
        // icon="check_circle"
        subHeading={[
          <span className="highlight" key="movieCount">
            {getType("movie")} Movies,{" "}
          </span>,
          <span className="highlight" key="seriesCount">
            {getType("series")} TV Shows
          </span>,
        ]}
      />

      <div className="viewOptionsContainer">
        <div className="wrapper">
          <ViewOptions
            labels={{ off: "Show filters", on: "Hide filters" }}
            icons={{ off: "filter_list", on: "" }}
            toggleCallback={() => setShowFilters(!showFilters)}
            toggleStatus={showFilters}
          />

          <ViewOptions
            labels={{ off: "Compact view", on: "Card view" }}
            icons={{ off: "view_stream", on: "view_module" }}
            toggleCallback={() => setCompactView(!compactView)}
            toggleStatus={compactView}
          />
        </div>
      </div>

      {activeQuery && (
        <div className="activeQueries wrapper" style={{ padding: "1rem" }}>
          <button
            className="PillButton"
            onClick={_ => null}
            style={{
              fontSize: "1rem",
              margin: 0,
            }}
          >
            {activeQuery}
            <span style={{ fontSize: 24, verticalAlign: "middle" }}>
              {" "}
              &times;
            </span>

            {/* <MaterialIcon icon="close" /> */}
          </button>
        </div>
      )}

      <FilterAndSortProvider
        data={watched}
        queryCallback={query => setActiveQuery(query)}
        FilterAndSortUI={
          !showFilters
            ? {
                UI: QuickSearch,
                type: "simple",
                config: {
                  placeholder: UI_LABELS.quickSearchPlaceholder,
                },
              }
            : {
                UI: FilterAndSort,
                type: "combo",
                config: {
                  toggleCallback: () => setShowFilters(!showFilters),
                  sortKeys: ["year", "director"],
                },
              }
        }
      >
        {processedItems => (
          <WatchedList
            limit={renderedItemsLimit}
            infiniteScroll={renderedItemsLimit <= watched.length}
            watched={processedItems}
            title={`${processedItems.length} item${
              processedItems.length > 1 ? "s" : ""
            }`}
            compact={compactView}
          />
        )}
      </FilterAndSortProvider>
    </Layout>
  );
}
