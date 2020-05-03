/* ---------------------------------
createRemoteContent
--------------------------------- */

import React from "react";
import { put, takeEvery, select } from "redux-saga/effects";
import {
  showNotif,
  toggleModal,
  createRemoteContent,
  createRemoteContentPending,
  createRemoteContentError,
  createRemoteContentSuccess,
} from "../redux/actions";
import uuidv4 from "uuid";
import MaterialIcon from "../components/Misc/MaterialIcon";
import { db } from "../index";

function* createRemoteContentSaga(action) {
  const {
    payload: { data },
  } = action;

  const id = uuidv4();
  const timestamp = Date.now();
  const authSelector = state => state.authentication;

  const newItem = {
    id,
    timestamp,
    // TODO remove contentType
    ...data,
  };

  const {
    user: { uid },
  } = yield select(authSelector);

  yield put(createRemoteContentPending());

  try {
    const dbRef = db.ref();
    const contentRef = db.ref("content");
    const newItemRef = contentRef.push().key;

    const updates = {
      [`/content/${newItemRef}`]: newItem,
      [`/users/${uid}/${data.contentType}/${newItemRef}`]: true,
    };

    yield dbRef.update(updates);

    yield put(createRemoteContentSuccess());

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
  } catch (error) {
    //
    console.error(error);
    yield put(createRemoteContentError());
  }
}

/**
 * createContentWatcher
 */

export default function* createRemoteContentWatcher() {
  yield takeEvery(`${createRemoteContent}`, createRemoteContentSaga);
}
