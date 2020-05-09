/* ---------------------------------
DataProvider
--------------------------------- */

import React, { useState, useEffect } from "react";
import { db } from "../../index";
import { log } from "../../utils";
import { setInitialData } from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../Spinner/Spinner";

export default function DataProvider({ render, dataSet }) {
  /**
   * gets data from API
   * prepares data for use in the app
   * exposes api for filtering & sorting data
   *
   * it should:
   *  √ fetch remote data
   *  √ set remote data to global state
   *  √ feed data to consumer components
   *  √ use data from a cache when data has already been downloaded
   *  save new data
   *  edit data
   *  delete data
   *  sync data to remote DB
   *  filter, sort & manipulate data
   */

  const dispatch = useDispatch();
  const {
    user: { uid },
  } = useSelector(state => state.authentication);
  const userData = useSelector(state => state.userData);
  const [loading, setLoading] = useState(true);
  const data = userData[uid][dataSet];

  /**
   * Checks if any initial data exists in the remote DB
   * and, if so, feeds it to the app's state
   */

  async function fetchDBdata() {
    log("DataProvider: running fetchDBdata…");

    try {
      const contentRef = db.ref("content");
      const watchedRef = db.ref(`users/${uid}/watched`);
      const toWatchRef = db.ref(`users/${uid}/toWatch`);
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
          value => value === null || value === undefined
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

            // TODO also dispatch to notif
            if (err) { console.error(err); }
            
            else
            {
              log("Successfully initialized DB. Now syncing data to app state...");

              fetchDBdata();
            }
          }
        );
      }
      
      else
      {
        const mappedData = {
          watched: Object.keys(watchedData).map(key => ({
            key,
            ...contentData[key]
          })),
          // 0 => []
          toWatch: Object.keys(toWatchData).map(key => ({
            key,
            ...contentData[key]
          }))
        };

        dispatch(setInitialData({ uid, mappedData }))
        setLoading(false);
      }
    } catch (err) {
      // TODO also dispatch to notif
      console.error("@fetchDBData", err);
    }
  }

  useEffect(() => {
    data.length ? setLoading(false) : fetchDBdata();
  }, []);

  return loading ? <Spinner shadow="none" /> : render(data);
}
