/* ---------------------------------
createNote
--------------------------------- */

import { put, takeEvery, select } from "redux-saga/effects";
import {
  showNotif,
  toggleModal,
  createNote,
  createNotePending,
  createNoteError,
  createNoteSuccess,
} from "../redux/actions";
import uuidv4 from "uuid";
import { db } from "../index";

/**
 * createNoteSaga
 */

function* createNoteSaga(action) {
  const {
    payload: { note, contentRef, title },
  } = action;

  const authSelector = state => state.authentication;

  const {
    user: { uid },
  } = yield select(authSelector);

  const newNote = {
    id: uuidv4(),
    timestamp: Date.now(),
    content: note,
  };

  yield put(createNotePending());

  try {
    const dbRef = db.ref();

    // TODO use call
    yield dbRef.update({
      [`/notes/${uid}/${contentRef}`]: newNote,
    });

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
