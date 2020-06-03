/* ---------------------------------
convertContent
--------------------------------- */

import React from "react";
import { put, takeEvery, select } from "redux-saga/effects";
import {
  convertContent,
  convertContentPending,
  convertContentError,
  convertContentSuccess,
  showNotif,
} from "../redux/actions";
import MaterialIcon from "../components/Misc/MaterialIcon";
import { db } from "../index";
import { log } from "../utils";
import { SECONDARY_DATASET_KEY } from "../constants";

/**
 * convertContentSaga
 */

function* convertContentSaga(action) {
  const {
    payload: { from, to, key, title },
  } = action;

  const authSelector = state => state.authentication;
  const {
    user: { uid },
  } = yield select(authSelector);

  yield put(convertContentPending());

  try {
    const dbRef = db.ref();
    const updates = {
      [`/users/${uid}/${from}/${key}`]: null,
      [`/users/${uid}/${to}/${key}`]: true,
    };

    yield dbRef.update(updates);

    yield put(
      convertContentSuccess({
        uid,
        from,
        to,
        key,
      })
    );

    yield put(
      showNotif({
        message: `${
          from === SECONDARY_DATASET_KEY ? "Watched:" : "To Watch:"
        } ${title}`,
        // TODO create the modal w/ the MaterialIcon comp baked-in
        icon: <MaterialIcon icon="bookmark" />,
        timeOut: 2000,
        theme: "light",
      })
    );

    //
  } catch (error) {
    //
    console.error(error);
    yield put(convertContentError({ error }));
  }
}

/**
 * convertContentWatcher
 */

export default function* convertContentWatcher() {
  yield takeEvery(`${convertContent}`, convertContentSaga);
}
