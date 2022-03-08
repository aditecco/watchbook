/* ---------------------------------
DataProvider
--------------------------------- */

import React, { useEffect, useState } from "react";
import { db } from "../../index";
import { log } from "../../utils";
import { setInitialData } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";
import { RootState } from "../../store";
import { TagType } from "../../types";

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
  } = useSelector((state: RootState) => state.authentication);
  const userData = useSelector((state: RootState) => state.userData);
  const [loading, setLoading] = useState(true);
  const data = userData[uid][dataSet];
  const initialSettings = { apiKey: 0 };

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
      const notesRef = db.ref(`notes/${uid}`);
      const tagsRef = db.ref(`tags/${uid}`);
      const ratingsRef = db.ref(`ratings/${uid}`);
      const content = await contentRef.once("value");
      const watched = await watchedRef.once("value");
      const toWatch = await toWatchRef.once("value");
      const notes = await notesRef.once("value");
      const tags = await tagsRef.once("value");
      const ratings = await ratingsRef.once("value");
      const contentData = await content.val();
      const watchedData = await watched.val();
      const toWatchData = await toWatch.val();
      const noteData = await notes.val();
      const tagData = await tags.val();
      const ratingData = await ratings.val();

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
            [`/settings/${uid}`]: initialSettings,
            [`/notes/${uid}`]: 0,
            [`/tags/${uid}`]: 0,
            [`/ratings/${uid}`]: 0
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
          watched: Object.keys(watchedData).map(id => ({
            key: id,
            ...contentData[id],
            notes: noteData?.[id]?.["content"],
            tags: Object.values(
              (tagData as Record<string, TagType>) ?? {}
            )?.filter?.((t: TagType) => t.assignedTo[id]), // TODO tags are multiple
            rating: ratingData?.[id]?.["rating"],
          })),

          // 0 => []
          toWatch: Object.keys(toWatchData).map(id => ({
            key: id,
            ...contentData[id],
            notes: noteData?.[id]?.["content"],
            tags: Object.values(
              (tagData as Record<string, TagType>) ?? {}
            )?.filter?.((t: TagType) => t.assignedTo[id]),
          })),
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
