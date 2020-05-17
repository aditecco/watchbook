/* ---------------------------------
ToWatch
--------------------------------- */

import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import WatchedList from "../../components/WatchedList/WatchedList";
import { useSelector } from "react-redux";
import { log } from "../../utils";

export default function ToWatch() {
  // global state
  const {
    user: { uid },
  } = useSelector(state => state.authentication);
  const userData = useSelector(state => state.userData);

  // localState
  const [compactView, setCompactView] = useState(false);

  // other
  const { toWatch } = userData[uid];
  const getType = type => toWatch.filter(item => item.type === type).length;

  /**
   * Effects
   */

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout rootClass="ToWatch" selected={3}>
      <PageHeader
        title="to watch"
        // icon="bookmark"
        subHeading={[
          <span className="highlight" key="movieCount">
            {getType("movie")} Movies,{" "}
          </span>,
          <span className="highlight" key="seriesCount">
            {getType("series")} TV Shows
          </span>,
        ]}
      />

      <WatchedList
        watched={userData[uid]["toWatch"]}
        title={`${toWatch.length} item${toWatch.length > 1 ? "s" : ""}`}
        compact={compactView}
      />
    </Layout>
  );
}
