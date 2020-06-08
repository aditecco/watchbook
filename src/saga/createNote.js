/* ---------------------------------
createNote
--------------------------------- */

import React from "react";
import { put, takeEvery, select } from "redux-saga/effects";
import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../constants";
import {
  showNotif,
  toggleModal,
  createNote,
  createNotePending,
  createNoteError,
  createNoteSuccess,
  createWatched,
  createToWatch,
  resetQueryData,
} from "../redux/actions";
import uuidv4 from "uuid";
import MaterialIcon from "../components/Misc/MaterialIcon";
import { db } from "../index";
import { filterKeys } from "../utils";

/**
 * createNoteSaga
 */

function* createNoteSaga(action) {
  const {
    payload: { note, contentRef, title },
  } = action;

  const id = uuidv4();
  const authSelector = state => state.authentication;

  const {
    user: { uid },
  } = yield select(authSelector);

  const newNote = {
    id,
    timestamp: Date.now(),
    content: note,
    author: uid,
  };

  yield put(createNotePending());

  try {
    const dbRef = db.ref();
    const notesRef = db.ref("notes");
    // const newItemRef = notesRef.push().key;
    // let key;

    const updates = {
      [`/notes/${contentRef}`]: newNote,
      [`/users/${uid}/notes/${contentRef}`]: true,
    };

    // TODO use call
    yield dbRef.update(updates);

    yield put(createNoteSuccess());

    yield put(toggleModal());

    yield put(
      showNotif({
        // TODO
        message: `Created note for: ${title}`,
        icon: "bookmark",
        timeOut: 2000,
        theme: "light",
      })
    );

    //
  } catch (error) {
    //
    console.error(error);
    yield put(createNoteError({ error }));
  }
}

/**
 * createNoteWatcher
 */

export default function* createNoteWatcher() {
  yield takeEvery(`${createNote}`, createNoteSaga);
}
