/* ---------------------------------
ContentPage
--------------------------------- */

import React, { useReducer, useEffect } from "react";
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
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      showFilters: false,
      compactView: false,
      renderedItemsLimit: 10,
      activeQuery: "",
      resetFilters: false,
    }
  );

  const {
    showFilters,
    compactView,
    renderedItemsLimit,
    activeQuery,
    resetFilters,
  } = state;

  // other
  const content = userData[uid][dataSet];
  const getType = type => content.filter(item => item.type === type).length;

  /**
   * The intersection observer callback
   */

  function handleObserver(entries, observer) {
    // log("intersecting…", entries, observer);

    setState({ renderedItemsLimit: renderedItemsLimit + 10 });
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
              setState({ resetFilters: true, setActiveQuery: "" });
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
