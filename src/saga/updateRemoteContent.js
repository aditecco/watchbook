/* ---------------------------------
updateRemoteContent
--------------------------------- */

import React from "react";
import { put, takeEvery, select } from "redux-saga/effects";
import {
  showNotif,
  toggleModal,
  updateRemoteContent,
  updateRemoteContentPending,
  updateRemoteContentError,
  updateRemoteContentSuccess,
  createWatched,
  createToWatch,
  resetQueryData,
} from "../redux/actions";
import uuidv4 from "uuid";
import MaterialIcon from "../components/Misc/MaterialIcon";
import { db } from "../index";
import { log, filterKeys, normalize } from "../utils";

/**
 * updateRemoteContentSaga
 */

function* updateRemoteContentSaga(action) {
  const {
    payload: [key, data],
  } = action;

  const updateTimestamp = Date.now();
  // const authSelector = state => state.authentication;

  // const newItem = {
  //   timestamp,
  //   ...filterKeys(data, "contentType"),
  // };

  // const {
  //   user: { uid },
  // } = yield select(authSelector);

  yield put(updateRemoteContentPending());

  try {
    const itemRef = db.ref(`/content/${key}`);
    const content = yield itemRef.once("value");
    const value = yield content.val();

    const mergedData = {
      ...value,
      ...normalize(data),
      updateTimestamp,
    };

    log(mergedData);

    // TODO should we handle this outside the saga?
    // yield put(
    //   data.contentType === "watched"
    //     ? createWatched({ watchedItem: newItem, uid })
    //     : createToWatch({ toWatchItem: newItem, uid })
    // );

    // TODO use call

    yield itemRef.update(mergedData);

    yield put(updateRemoteContentSuccess());
    /*
    yield put(toggleModal());

    yield put(
      showNotif({
        // TODO
        message: `${data.contentType}: ${newItem.title}`,
        icon: <MaterialIcon icon="bookmark" />,
        timeOut: 2000,
        theme: "light",
      })
    );

    yield put(resetQueryData());
    //
  } catch (error) {
    //
    console.error(error);
    yield put(updateRemoteContentError({ error }));
    */
  } catch (error) {
    console.error(error);
  }
}

/**
 * updateRemoteContentWatcher
 */

export default function* updateRemoteContentWatcher() {
  yield takeEvery(`${updateRemoteContent}`, updateRemoteContentSaga);
}
