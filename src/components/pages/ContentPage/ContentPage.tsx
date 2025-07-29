"use client";

import React, {
  ReactElement,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useInView } from "react-intersection-observer";
import FilterAndSort from "@/components/FilterAndSort/FilterAndSort";
import FilterProvider from "@/components/FilterProvider";
import Layout from "@/components/Layout/Layout";
import PageHeader from "@/components/PageHeader/PageHeader";
import ViewOptions from "@/components/ViewOptions/ViewOptions";
import ContentList from "@/components/ContentList/ContentList";
import QuickSearch from "@/components/QuickSearch/QuickSearch";
import DataProvider from "@/components/DataProvider";
import { UI_LABELS } from "@/constants";
import { useAppStore } from "@/store";
import { Dataset } from "@/types";

interface OwnProps {
  dataSet: Dataset;
  icon?: string;
  selectedIndex: number;
  subHeading?: string;
  title: string;
}

interface LocalState {
  showFilters: boolean;
  compactView: boolean;
  activeQuery: string;
  resetFilters: boolean;
}

export default function ContentPage({
  dataSet,
  icon,
  selectedIndex,
  subHeading,
  title,
}: OwnProps): ReactElement {
  // global state
  const { auth } = useAppStore();

  // local state
  const initialState: LocalState = {
    showFilters: false,
    compactView: true,
    activeQuery: "",
    resetFilters: false,
  };

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialState,
  );

  const { showFilters, compactView, activeQuery, resetFilters } = state;

  // New state for handling multiple active filters
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const [renderedItemsLimit, setRenderedItemsLimit] = useState(10);

  // intersection observer hook
  const [ref, inView, entry] = useInView({
    root: null, // uses the viewport
    rootMargin: "0px",
    threshold: 0.25,
  });

  // other
  const initialPageIndex = useRef(selectedIndex);

  // didMount
  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);
  }, []);

  // selectedIndex
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
      // Clear active filters and search query on page change
      setActiveFilters({});
      setSearchQuery("");
      // TODO merge
      setRenderedItemsLimit(10);

      // reset scroll position when we enter the page
      window.scrollTo(0, 0);
    }
  }, [selectedIndex]);

  // inView
  useEffect(() => {
    inView && setRenderedItemsLimit((limit) => limit + 10);
  }, [inView]);

  // Handle resetFilters
  useEffect(() => {
    if (resetFilters) {
      setActiveFilters({});
      setSearchQuery("");
      setState({ resetFilters: false });
    }
  }, [resetFilters]);

  return (
    <Layout rootClass="ContentPage" selected={selectedIndex}>
      <DataProvider
        dataSet={dataSet}
        render={(content) => {
          // Calculate counts for dynamic subtitle
          const movieCount = content.filter(
            (item: any) => item.type === "movie",
          ).length;
          const seriesCount = content.filter(
            (item: any) => item.type === "series",
          ).length;

          const subHeading =
            content.length > 0
              ? [
                  <span className="highlight" key="movieCount">
                    {movieCount} MOVIE{movieCount !== 1 ? "S" : ""},{" "}
                  </span>,
                  <span className="highlight" key="seriesCount">
                    {seriesCount} TV SHOW{seriesCount !== 1 ? "S" : ""}
                  </span>,
                ]
              : title === "Watched"
                ? "No watched items yet"
                : "No items to watch yet";

          return (
            <>
              <PageHeader title={title} icon={icon} subHeading={subHeading} />

              <div className="viewOptionsContainer">
                <div className="wrapper">
                  <ViewOptions
                    labels={{ off: "Show filters", on: "Hide filters" }}
                    icons={{ off: "filter_list", on: "filter_list" }}
                    toggleCallback={() =>
                      setState({ showFilters: !showFilters })
                    }
                    toggleStatus={showFilters}
                  />

                  <ViewOptions
                    labels={{ off: "Compact view", on: "Card view" }}
                    icons={{ off: "view_module", on: "view_list" }}
                    toggleCallback={() =>
                      setState({ compactView: !compactView })
                    }
                    toggleStatus={compactView}
                  />
                </div>
              </div>

              {(Object.keys(activeFilters).length > 0 || searchQuery) && (
                <div
                  className="activeQueries wrapper"
                  style={{ padding: "1rem" }}
                >
                  {searchQuery && (
                    <button
                      className="PillButton"
                      onClick={() => {
                        setSearchQuery("");
                        setState({ resetFilters: true });
                      }}
                      style={{
                        fontSize: "1rem",
                        margin: "0 0.5rem 0.5rem 0",
                        background: "#e3f2fd",
                        color: "#1976d2",
                        border: "1px solid #1976d2",
                      }}
                    >
                      search: "{searchQuery}"
                      <span style={{ fontSize: 24, verticalAlign: "middle" }}>
                        {" "}
                        &times;
                      </span>
                    </button>
                  )}

                  {Object.entries(activeFilters).map(
                    ([filterKey, filterValue]) => (
                      <button
                        key={filterKey}
                        className="PillButton"
                        onClick={() => {
                          const newFilters = { ...activeFilters };
                          delete newFilters[filterKey];
                          setActiveFilters(newFilters);
                          setState({ resetFilters: true });
                        }}
                        style={{
                          fontSize: "1rem",
                          margin: "0 0.5rem 0.5rem 0",
                          background: "#fff3e0",
                          color: "#f57c00",
                          border: "1px solid #f57c00",
                        }}
                      >
                        {filterKey}: {filterValue}
                        <span style={{ fontSize: 24, verticalAlign: "middle" }}>
                          {" "}
                          &times;
                        </span>
                      </button>
                    ),
                  )}
                </div>
              )}

              <FilterProvider
                data={content}
                queryCallback={(data: any) => {
                  if (data.activeFilters) {
                    setActiveFilters(data.activeFilters);
                  }
                  if (data.searchQuery !== undefined) {
                    setSearchQuery(data.searchQuery);
                  }
                }}
                remoteReset={resetFilters}
                FilterUI={
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
                          toggleCallback: () =>
                            setState({ showFilters: !showFilters }),
                          sortKeys: [
                            "year",
                            "director",
                            "country",
                            "genre",
                            "type",
                            "runtime",
                          ],
                        },
                      }
                }
              >
                {(filteredData: any[]) => (
                  <ContentList
                    content={filteredData}
                    dataSet={dataSet}
                    title={title}
                    compact={compactView}
                    limit={renderedItemsLimit}
                    infiniteScroll
                    observerRef={ref}
                  />
                )}
              </FilterProvider>
            </>
          );
        }}
      />
    </Layout>
  );
}
