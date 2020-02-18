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
  const [compactView, setCompactView] = useState(null);
  const [{ user }] = useContext(AuthContext);
  const { uid } = user;

  return (
    <StoreContext.Consumer>
      {([store, dispatch]) => {
        const titleWithCount = `Watched (${store.users[uid]["watched"].length})`;
        const getType = type =>
          store.users[uid]["watched"].filter(item => item.type === type).length;

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

            <FilterAndSort
              filterHandler={e =>
                dispatch({
                  type: "FILTER_WATCHED",
                  payload: e.currentTarget.value
                })
              }
            />

            <ViewOptions
              labels={{ off: "Compact view", on: "Card view" }}
              toggleCallback={toggle => setCompactView(toggle)}
            />

            {store.filter && store.filter.length ? (
              <WatchedList
                watched={store.filter}
                title={titleWithCount}
                compact={compactView}
              />
            ) : store.sorted && store.sorted.length ? (
              <WatchedList
                watched={store.sorted}
                title={titleWithCount}
                compact={compactView}
              />
            ) : (
              <WatchedList
                watched={store.users[uid]["watched"]}
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
