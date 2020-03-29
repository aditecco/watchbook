/* ---------------------------------
DataProvider
--------------------------------- */

import React, { useReducer, useEffect, useContext } from "react";
import TEST_DATA from "../../testData";
import { AuthContext, StoreContext, db } from "../../App";
import { log } from "../../utils";

export default function DataProvider({ render }) {
  /**
   * gets data from API
   * prepares data for use in the app
   * exposes api for filtering & sorting data
   *
   * it should:
   *  √ fetch remote data
   *  √ set remote data to global state
   *  √ feed data to consumer components
   *  save new data
   *  edit data
   *  delete data
   *  sync data to remote DB
   *  filter, sort & manipulate data
   */

  const [state, setState] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState
    }),
    {
      loading: true,
      data: null
    }
  );

  const { loading, data } = state;

  const [store, dispatch] = useContext(StoreContext);
  const [{ user }] = useContext(AuthContext);
  const { uid } = user;

  const contentRef = db.ref("content");
  const watchedRef = db.ref(`users/${uid}/watched`);
  const userRef = db.ref(`users/${uid}`);
  const toWatchRef = db.ref(`users/${uid}/toWatch`);

  const loader = (
    <div className="blankSlate">
      <span>Loading…</span>
    </div>
  );

  /**
   * Checks if any initial data exists in the remote DB
   * and, if so, feeds it to the app's state
   */

  useEffect(() => {
    (async function fetchDBdata() {
      // setState({ loading: true });
      log("Running fetchDBdata…");

      try {
        const content = await contentRef.once("value");
        const watched = await watchedRef.once("value");
        const toWatch = await toWatchRef.once("value");
        const contentData = await content.val();
        const watchedData = await watched.val();
        const toWatchData = await toWatch.val();

        // prettier-ignore
        // TODO how do we define this case?
        if (
          [contentData, watchedData, toWatchData]
          .some(result => result === null || result === undefined))
        {
          // write initialData to DB
          userRef.set(TEST_DATA, err => {
            // firebase won't accept empty values
            // should be: { watched: [], toWatch: [] }

            if (err) {
              throw err;
            } else {
              log(
                "Successfully initialized DB. Now syncing data to app state..."
              );

              fetchDBdata();
            }
          });
        }
        
        else
        {
          const mappedData = {
            watched: Object.keys(watchedData).map(key => contentData[key]),
            // 0 => []
            toWatch: Object.keys(toWatchData).map(key => content[key])
          }

          dispatch({ type: "SET_INITIAL_DATA", uid, mappedData });
          setState({ loading: false, });
        }
      } catch (err) {
        console.error("@fetchDBData", err);
      }
    })(); // IIFE;
  }, []);

  return !loading ? render(store.userData[uid]["watched"]) : loader;
}
