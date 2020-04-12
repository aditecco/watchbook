/* ---------------------------------
Watched
--------------------------------- */

import React, { useState } from "react";
import { log } from "../../utils";
import { useSelector, useDispatch } from "react-redux";
import FilterAndSort from "../../components/FilterAndSort/FilterAndSort";
import FilterAndSortProvider from "../../components/FilterAndSortProvider";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import ViewOptions from "../../components/ViewOptions/ViewOptions";
import WatchedList from "../../components/WatchedList/WatchedList";

export default function Watched() {
  // global state
  const dispatch = useDispatch();
  const {
    user: { uid },
  } = useSelector(state => state.authentication);
  const userData = useSelector(state => state.userData);

  // local state
  const [showFilters, setShowFilters] = useState(false);
  const [compactView, setCompactView] = useState(false);

  // other
  const { watched } = userData[uid]; // watched items cache
  const titleWithCount = `Watched (${watched.length})`;
  const getType = type => watched.filter(item => item.type === type).length;

  return (
    <Layout rootClass="Watched" selected={2}>
      <PageHeader
        title="watched"
        icon="check_circle"
        subHeading={
          <>
            <span className="highlight">{getType("movie")} Movies, </span>
            <span className="highlight">{getType("series")} TV Shows</span>
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

      <FilterAndSortProvider
        toggleUI={showFilters}
        FilterAndSortUI={FilterAndSort}
        data={watched}
      >
        {processedItems => (
          <WatchedList
            watched={processedItems}
            title={titleWithCount}
            compact={compactView}
          />
        )}
      </FilterAndSortProvider>
    </Layout>
  );
}
