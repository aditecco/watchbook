/* ---------------------------------
DataProvider
--------------------------------- */

import React, { useReducer, useEffect, useContext } from "react";
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
  // const userRef = db.ref(`users/${uid}`);
  const watchedRef = db.ref(`users/${uid}/watched`);
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
      log("DataProvider: running fetchDBdata…");

      try {
        const content = await contentRef.once("value");
        const watched = await watchedRef.once("value");
        const toWatch = await toWatchRef.once("value");
        const contentData = await content.val();
        const watchedData = await watched.val();
        const toWatchData = await toWatch.val();

        // prettier-ignore
        // NEW USER INITIALIZER
        if (
          [watchedData, toWatchData].every(
            result => result === null || result === undefined
          )
        ) {
          // write initialData to DB
          // firebase won't accept empty values, so we use 0
          db.ref().update(
            {
              [`/users/${uid}`]: { watched: 0, toWatch: 0 },
              [`/settings/${uid}`]: { apiKey: 0 } // TODO is this the right place?
            },

            // completion cb
            err => {
              if (err) {
                console.error(err);
              } else {
                log(
                  "Successfully initialized DB. Now syncing data to app state..."
                );

                fetchDBdata();
              }
            }
          );
        } else {
          const mappedData = {
            watched: Object.keys(watchedData).map(key => contentData[key]),
            // 0 => []
            toWatch: Object.keys(toWatchData).map(key => contentData[key])
          };

          dispatch({ type: "SET_INITIAL_DATA", uid, mappedData });
          setState({ loading: false });
        }
      } catch (err) {
        console.error("@fetchDBData", err);
      }
    })(); // IIFE;
  }, []);

  return !loading ? render(store.userData[uid]["watched"]) : loader;
}
