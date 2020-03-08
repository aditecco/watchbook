/* ---------------------------------
Watched
--------------------------------- */

import React, { useState, useContext, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import WatchedList from "../../components/WatchedList/WatchedList";
import FilterAndSort from "../../components/FilterAndSort/FilterAndSort";
import ViewOptions from "../../components/ViewOptions/ViewOptions";
import { AuthContext, StoreContext } from "../../App";
import { log } from "../../utils";

export default function Watched() {
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [{ user }] = useContext(AuthContext);
  const { uid } = user;
  const [sorted, setSorted] = useState([]);

  return (
    <StoreContext.Consumer>
      {([store, dispatch]) => {
        const { watched } = store.userData[uid]; // watched items cache
        const titleWithCount = `Watched (${watched.length})`;
        const getType = type =>
          watched.filter(item => item.type === type).length;
        const watchedItemsYears = ["Select a year"].concat(
          watched.map(item => item.year)
        );

        function handleSortByYear(e) {
          const year = e.target.value;
          log(year);

          setSorted(watched.filter(item => item.year === year));
        }

        return (
          <Layout rootClass="Watched" selected={2}>
            <PageHeader
              title="watched"
              icon="check_circle"
              subHeading={
                <>
                  <span className="highlight">{getType("movie")} Movies, </span>
                  <span className="highlight">
                    {getType("series")} TV Shows
                  </span>
                </>
              }
            />

            <div className="viewOptionsContainer">
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

            {showFilters && (
              <FilterAndSort
                filterHandler={e =>
                  dispatch({
                    type: "FILTER_WATCHED",
                    query: e.currentTarget.value,
                    uid
                  })
                }
                sortHandler={handleSortByYear}
                sortOptions={watchedItemsYears}
              />
            )}

            {store.filter && store.filter.length ? (
              <WatchedList
                watched={store.filter}
                title={titleWithCount}
                compact={compactView}
              />
            ) : sorted && sorted.length ? (
              <WatchedList
                watched={sorted}
                title={titleWithCount}
                compact={compactView}
              />
            ) : (
              <WatchedList
                watched={store.userData[uid]["watched"]}
                title={titleWithCount}
                compact={compactView}
              />
            )}
          </Layout>
        );
      }}
    </StoreContext.Consumer>
  );
}
