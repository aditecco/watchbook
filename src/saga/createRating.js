/* ---------------------------------
createRating
--------------------------------- */

import { put, takeEvery, select } from "redux-saga/effects";
import {
  showNotif,
  createRating,
  createRatingPending,
  createRatingError,
  createRatingSuccess,
} from "../redux/actions";
import uuidv4 from "uuid";
import { db } from "../index";

/**
 * createRatingSaga
 */

function* createRatingSaga(action) {
  const {
    payload: { rating, contentRef, title },
  } = action;

  const authSelector = state => state.authentication;

  const {
    user: { uid },
  } = yield select(authSelector);

  const newRating = {
    id: uuidv4(),
    timestamp: Date.now(),
    rating,
  };

  yield put(createRatingPending());

  try {
    const dbRef = db.ref();

    // TODO use call
    yield dbRef.update({
      [`/ratings/${uid}/${contentRef}`]: newRating,
    });

    yield put(createRatingSuccess());

    yield put(
      showNotif({
        message: `Rated ${rating} stars for ${title}`,
        icon: "star",
        timeOut: 2000,
        theme: "light",
      })
    );

    //
  } catch (error) {
    //
    console.error(error);
    yield put(createRatingError({ error }));
  }
}

/**
 * createRatingWatcher
 */

export default function* createRatingWatcher() {
  yield takeEvery(`${createRating}`, createRatingSaga);
}
