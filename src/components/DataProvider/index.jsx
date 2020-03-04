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

  const loader = (
    <div className="blankSlate">
      <span>Loading…</span>
    </div>
  );
  const [store, dispatch] = useContext(StoreContext);
  const [{ user }] = useContext(AuthContext);
  const { uid } = user;
  const dbUser = db.ref(`users/${uid}`);

  /**
   * Checks if any initial data exists in the remote DB
   * and, if so, feeds it to the app's state
   */

  useEffect(() => {
    (async function fetchDBdata() {
      // setState({ loading: true });
      log("Running fetchDBdata…");

      try {
        const dbUserWatched = dbUser.child("watched");
        const value = await dbUserWatched.once("value");
        const remoteData = await value.val();

        // prettier-ignore
        if (!remoteData)
        {
          // write initialData to DB
          dbUser.set(TEST_DATA, err => {
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
          dispatch({ type: "SET_INITIAL_DATA", uid, remoteData });
          setState({
            loading: false,
            // data: store.userData[uid]["watched"]
          });
        }
      } catch (err) {
        console.error("@fetchDBData", err);
      }
    })(); // IIFE;
  }, []);

  return <>{!loading ? render(store.userData[uid]["watched"]) : loader}</>;
}
