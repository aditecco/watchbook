/* ---------------------------------
fetchQueryData
--------------------------------- */

import { call, put, takeLatest } from "redux-saga/effects";
import { API_KEY_ID } from "../constants";
import {
  showNotif,
  refreshCardData,
  refreshCardDataPending,
  refreshCardDataSuccess,
  refreshCardDataError,
} from "../redux/actions";
import { log, storage, requestUrl, buildQuery } from "../utils";
import axios from "axios";

/**
 * refreshCardDataSaga
 */

function* refreshCardDataSaga(action) {
  const apiKey = storage.pull(API_KEY_ID);
  const { payload } = action;
  log(payload);

  yield put(refreshCardDataPending());

  try {
    const request = yield call(
      axios.get,
      requestUrl(
        apiKey,
        buildQuery({
          t: payload.title,
          type: payload.type,
          y: payload.year,
        })
      )
    );

    const { data: response } = request;
    log(response);

    /**
     * we handle 200 responses
     * that are considered errors
     * by the API
     */
    if ("Error" in response) {
      throw new Error(response.Error);
    }

    yield put(refreshCardDataSuccess({ response }));
    //
  } catch (error) {
    // the augmented error
    if ("response" in error) {
      const {
        status,
        data: { Error: message },
      } = error.response;

      yield put(
        showNotif({
          message: `${status} Error: ${message}`,
          icon: null,
          timeOut: 4000,
        })
      );
    }

    // 'error' force-thrown from a 200 response
    else {
      yield put(
        showNotif({
          message: `Error: ${error.message}`,
          icon: null,
          timeOut: 4000,
        })
      );
    }

    // we print the error response
    // by default, or undefined
    yield put(refreshCardDataError({ error: error.response || error.message }));
    console.error(error.response || error.message);
  }
}

/**
 * refreshCardDataWatcher
 */

export default function* refreshCardDataWatcher() {
  yield takeLatest(`${refreshCardData}`, refreshCardDataSaga);
}
