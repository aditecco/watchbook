/* ---------------------------------
deleteContent
--------------------------------- */

import React from "react";
import { put, takeEvery, select } from "redux-saga/effects";
import {
  deleteContent,
  deleteContentPending,
  deleteContentError,
  deleteContentSuccess,
  showNotif,
} from "../redux/actions";
import MaterialIcon from "../components/Misc/MaterialIcon";
import { db } from "../index";
import { log } from "../utils";

/**
 * deleteContentSaga
 */

function* deleteContentSaga(action) {
  const {
    payload: { contentType, key, title },
  } = action;

  const authSelector = state => state.authentication;
  const {
    user: { uid },
  } = yield select(authSelector);

  yield put(deleteContentPending());

  try {
    // TODO
    log(contentType, key, title);
    //
    const dbRef = db.ref();
    const updates = {
      [`/content/${key}`]: null,
      [`/users/${uid}/${contentType}/${key}`]: null,
    };

    yield dbRef.update(updates);

    yield put(deleteContentSuccess());

    yield put(
      showNotif({
        message: `Removed: ${title}`,
        icon: <MaterialIcon icon="remove_circle" />,
        timeOut: 2000,
        theme: "light",
      })
    );

    //
  } catch (error) {
    //
    console.error(error);
    yield put(deleteContentError({ error }));
  }
}

/**
 * deleteContentWatcher
 */

export default function* deleteContentWatcher() {
  yield takeEvery(`${deleteContent}`, deleteContentSaga);
}
