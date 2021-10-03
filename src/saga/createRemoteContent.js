/* ---------------------------------
createRemoteContent
--------------------------------- */

import { put, takeEvery, select } from "redux-saga/effects";
import { PRIMARY_DATASET_KEY } from "../constants";
import {
  showNotif,
  toggleModal,
  createRemoteContent,
  createRemoteContentPending,
  createRemoteContentError,
  createRemoteContentSuccess,
  createWatched,
  createToWatch,
  resetQueryData,
} from "../redux/actions";
import uuidv4 from "uuid";
import { db } from "../index";
import { filterKeys } from "../utils";

/**
 * createRemoteContentSaga
 */

function* createRemoteContentSaga(action) {
  const {
    payload: { data },
  } = action;

  const id = uuidv4();
  const authSelector = state => state.authentication;

  const newItem = {
    id,
    timestamp: Date.now(),
    ...filterKeys(data, "contentType"),
  };

  const {
    user: { uid },
  } = yield select(authSelector);

  yield put(createRemoteContentPending());

  try {
    const dbRef = db.ref();
    const contentRef = db.ref("content");
    const newItemRef = contentRef.push().key;
    let key;

    const updates = {
      [`/content/${newItemRef}`]: newItem,
      [`/users/${uid}/${data.contentType}/${newItemRef}`]: true,
    };

    // we observe the DB location for new items
    contentRef.once("child_added", snapshot => {
      key = snapshot.key;
    });

    // TODO use call
    yield dbRef.update(updates);

    // TODO should we handle this outside the saga?
    yield put(
      data.contentType === PRIMARY_DATASET_KEY
        ? createWatched({ watchedItem: { key, ...newItem }, uid })
        : createToWatch({ toWatchItem: { key, ...newItem }, uid })
    );

    yield put(createRemoteContentSuccess());

    yield put(toggleModal());

    yield put(
      showNotif({
        // TODO
        message: `${data.contentType}: ${newItem.title}`,
        icon: "bookmark",
        timeOut: 2000,
        theme: "light",
      })
    );

    yield put(resetQueryData());
    //
  } catch (error) {
    //
    console.error(error);
    yield put(createRemoteContentError({ error }));
  }
}

/**
 * createRemoteContentWatcher
 */

export default function* createRemoteContentWatcher() {
  yield takeEvery(`${createRemoteContent}`, createRemoteContentSaga);
}
