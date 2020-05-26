/* ---------------------------------
ContentPage
--------------------------------- */

import React, { useState, useReducer, useEffect, useRef } from "react";
import { log } from "../../utils";
import { useSelector } from "react-redux";
import FilterAndSort from "../../components/FilterAndSort/FilterAndSort";
import FilterAndSortProvider from "../../components/FilterAndSortProvider";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import ViewOptions from "../../components/ViewOptions/ViewOptions";
import ContentList from "../../components/ContentList/ContentList";
import QuickSearch from "../../components/QuickSearch/QuickSearch";
import { UI_LABELS } from "../../constants";
import sample from "../../sampleData";

export default function ContentPage({
  dataSet,
  icon,
  selectedIndex,
  subHeading,
  title,
}) {
  // global state
  const {
    user: { uid },
  } = useSelector(state => state.authentication);
  const userData = useSelector(state => state.userData);

  // local state
  const initialState = {
    showFilters: false,
    compactView: false,
    activeQuery: "",
    resetFilters: false,
  };

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState
  );

  const { showFilters, compactView, activeQuery, resetFilters } = state;

  const [renderedItemsLimit, setRenderedItemsLimit] = useState(10);

  // observer init
  const observer = new IntersectionObserver(handleObserver, {
    root: null, // uses the viewport
    rootMargin: "0px",
    threshold: 0.25,
  });

  // other
  const initialPageIndex = useRef(selectedIndex);
  const _observer = useRef(observer);
  const _target = useRef();
  const content = userData[uid][dataSet];
  const getType = type => content.filter(item => item.type === type).length;

  /**
   * Intersection observer callback
   */

  function handleObserver(entries, observer) {
    // log("intersecting…", entries, observer);
    console.count("@handleObserver");

    setRenderedItemsLimit(limit => limit + 10);
  }

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);

    // start observing
    _target.current = document.querySelector(".infiniteScrollLoader");
    _target.current && _observer.current.observe(_target.current);

    // stop observing on unmount
    return () =>
      _target.current && _observer.current.unobserve(_target.current);
  }, []);

  useEffect(() => {
    /**
     * the index we saved on mount is
     * different than the current prop val
     */

    if (selectedIndex !== initialPageIndex.current) {
      // we re-assign the value for the next cycle
      initialPageIndex.current = selectedIndex;

      // we re-initialize the state on page change
      setState(initialState);
      // TODO merge
      setRenderedItemsLimit(10);

      // reset scroll position when we enter the page
      window.scrollTo(0, 0);

      // restart the observer
      if (_target.current) {
        _observer.current.disconnect();
        _observer.current.observe(_target.current);
      }
    }
  }, [selectedIndex]);

  return (
    <Layout rootClass="ContentPage" selected={selectedIndex}>
      <PageHeader
        title={title}
        icon={icon}
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
            toggleCallback={() => setState({ showFilters: !showFilters })}
            toggleStatus={showFilters}
          />

          <ViewOptions
            labels={{ off: "Compact view", on: "Card view" }}
            icons={{ off: "view_stream", on: "view_module" }}
            toggleCallback={() => setState({ compactView: !compactView })}
            toggleStatus={compactView}
          />
        </div>
      </div>

      {activeQuery && (
        <div className="activeQueries wrapper" style={{ padding: "1rem" }}>
          <button
            className="PillButton"
            onClick={() => {
              setState({ resetFilters: true, activeQuery: "" });
            }}
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
        data={content}
        queryCallback={query => setState({ activeQuery: query })}
        remoteReset={resetFilters}
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
                  toggleCallback: () => setState({ showFilters: !showFilters }),
                  sortKeys: [
                    "year",
                    "director",
                    "country",
                    "genre",
                    "type",
                    //
                  ], // TODO expose as prop
                },
              }
        }
      >
        {processedItems => (
          <ContentList
            limit={renderedItemsLimit}
            infiniteScroll={renderedItemsLimit <= content.length}
            content={processedItems}
            title={`${processedItems && processedItems.length} item${
              processedItems && processedItems.length > 1 ? "s" : ""
            }`}
            compact={compactView}
          />
        )}
      </FilterAndSortProvider>
    </Layout>
  );
}
