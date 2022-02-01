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
import { TagType } from "../types";

/**
 * createTagSaga
 */

function* createTagSaga(action) {
  const {
    payload: { tag, contentRef, title, assignMultiple },
  } = action;

  const authSelector = state => state.authentication;

  const {
    user: { uid },
  } = yield select(authSelector);

  const newTag: TagType | Record<string, unknown> = tag
    ? {
        id: uuidv4(),
        timestamp: Date.now(),
        value: tag,
        label: tag,
        assignedTo: { [contentRef]: true },
      }
    : {};

  yield put(createTagPending());

  try {
    const path = `/tags/${uid}`;
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

    //
    if (assignMultiple) {
      const [where] = Object.entries(prevData as Record<string, TagType>).find(
        ([_, t]) => tag === t.value
      );

      yield dbRef.update({
        [`${path}/${where}`]: {
          ...prevData[where],
          assignedTo: {
            ...prevData[where].assignedTo,
            [contentRef]: true,
          },
        },
      });
    }

    //
    else {
      yield dbRef.update({
        [path]: {
          ...prevData,
          [k]: newTag,
        },
      });
    }

    // TODO use call

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
