/* ---------------------------------
updateRemoteContent
--------------------------------- */

import React from "react";
import { put, takeEvery } from "redux-saga/effects";
import {
  showNotif,
  updateRemoteContent,
  updateRemoteContentPending,
  updateRemoteContentSuccess,
  updateRemoteContentError,
} from "../redux/actions";
import { db } from "../index";
import { log, normalize } from "../utils";
import MaterialIcon from "../components/Misc/MaterialIcon";

/**
 * updateRemoteContentSaga
 */

function* updateRemoteContentSaga(action) {
  const {
    payload: [key, data],
  } = action;
  log(data);

  yield put(updateRemoteContentPending());

  try {
    const itemRef = db.ref(`/content/${key}`);
    const content = yield itemRef.once("value");
    const value = yield content.val();

    const mergedData = {
      ...value,
      ...normalize(data),
      updateTimestamp: Date.now(),
    };

    // TODO use call
    yield itemRef.update(mergedData);

    yield put(updateRemoteContentSuccess());

    yield put(
      showNotif({
        message: `Updated: ${data.Title}`,
        icon: <MaterialIcon icon="sync" />,
        timeOut: 2000,
        theme: "light",
      })
    );

    // TODO reset data in store
  } catch (error) {
    yield put(updateRemoteContentError({ error }));
  }
}

/**
 * updateRemoteContentWatcher
 */

export default function* updateRemoteContentWatcher() {
  yield takeEvery(`${updateRemoteContent}`, updateRemoteContentSaga);
}
