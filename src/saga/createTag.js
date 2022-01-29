/* ---------------------------------
createTag
--------------------------------- */

import { put, select, takeEvery } from "redux-saga/effects";
import {
  createTag,
  createTagError,
  createTagPending,
  createTagSuccess,
  showNotif,
  toggleModal,
} from "../redux/actions";
import uuidv4 from "uuid";
import { db } from "../index";

/**
 * createTagSaga
 */

function* createTagSaga(action) {
  const {
    payload: { tag, contentRef, title },
  } = action;

  const authSelector = state => state.authentication;

  const {
    user: { uid },
  } = yield select(authSelector);

  const newTag = tag
    ? {
        id: uuidv4(),
        timestamp: Date.now(),
        type: "",
        value: tag,
        // assignedTo: { [contentRef]: true },
        // NOTE add relationships?
      }
    : null;

  yield put(createTagPending());

  try {
    const path = `/tags/${uid}/${contentRef}`;
    const dbRef = db.ref();
    const pathRef = db.ref(path);
    const k = pathRef.push().key;
    let prevData = {};

    yield pathRef.once("value").then(snapshot => {
      const v = snapshot.val();
      if (v) {
        prevData = v;
      }
    });

    // TODO use call
    yield dbRef.update({
      [path]: {
        ...prevData,
        [k]: newTag,
      },
    });

    yield put(createTagSuccess());

    yield put(toggleModal());

    yield put(
      showNotif({
        // TODO
        message: `${tag ? "Created" : "Deleted"} new tag for: ${title}`,
        icon: "local_offer",
        timeOut: 2000,
        theme: "light",
      })
    );

    //
  } catch (error) {
    //
    console.error(error);
    yield put(createTagError({ error }));
  }
}

/**
 * createTagWatcher
 */

export default function* createTagWatcher() {
  yield takeEvery(`${createTag}`, createTagSaga);
}
