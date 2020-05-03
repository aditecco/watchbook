/* ---------------------------------
fetchAdditionalData
--------------------------------- */

import React from "react";
import { call, put, takeEvery, delay, select } from "redux-saga/effects";
import { API_KEY_ID } from "../constants";
import { showNotif, fetchAdditionalData, toggleModal } from "../redux/actions";
import { log, storage, requestUrl, buildQuery } from "../utils";
import axios from "axios";
import Card from "../components/Card/Card";

/**
 * fetchAdditionalDataSaga
 */

const apiKey = storage.pull(API_KEY_ID);

function* fetchAdditionalDataSaga(action) {
  const {
    payload: { id },
  } = action;

  const apiDataSelector = state => state.apiData;

  try {
    const apiData = yield select(apiDataSelector);

    const request = yield call(
      axios.get,
      requestUrl(apiKey, buildQuery({ i: id }))
    );

    const which = apiData.data.Search.find(item => item.imdbID === id);

    yield put(
      toggleModal({
        content: (
          <Card
            image={which.Poster}
            title={which.Title}
            type={which.Type}
            year={which.Year}
            additionalData={request.data}
            // onWatchedClick={handleAddWatched}
            // onToWatchClick={handleAddToWatch}
          />
        ),
      })
    );
  } catch (err) {
    yield put(
      showNotif({
        message: err.message,
        icon: null,
        timeOut: 4000,
      })
    );
  }
}

/**
 * fetchAdditionalDataWatcher
 */

export default function* fetchAdditionalDataWatcher() {
  yield takeEvery(`${fetchAdditionalData}`, fetchAdditionalDataSaga);
}
