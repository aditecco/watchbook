/* ---------------------------------
ToWatch
--------------------------------- */

import React, { useContext, useState } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { AuthContext, StoreContext } from "../../App";
import WatchedList from "../../components/WatchedList/WatchedList";
import { log } from "../../utils";

export default function ToWatch() {
  const [{ user }] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);
  const { toWatch } = store.userData[user.uid];
  const [compactView, setCompactView] = useState(false);
  const titleWithCount = `To Watch (${toWatch.length})`;
  const getType = type => toWatch.filter(item => item.type === type).length;

  return (
    <Layout rootClass="ToWatch" selected={3}>
      <PageHeader
        title="to watch"
        icon="bookmark"
        subHeading={
          <>
            <span className="highlight">{getType("movie")} Movies, </span>
            <span className="highlight">{getType("series")} TV Shows</span>
          </>
        }
      />

      <WatchedList
        watched={store.userData[user.uid]["toWatch"]}
        title={titleWithCount}
        compact={compactView}
      />
    </Layout>
  );
}
