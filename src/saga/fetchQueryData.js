/* ---------------------------------
fetchQueryData
--------------------------------- */

import { call, put, takeLatest, delay } from "redux-saga/effects";
import { API_KEY_ID } from "../constants";
import {
  showNotif,
  fetchQueryData,
  fetchQueryDataPending,
  fetchQueryDataSuccess,
  fetchQueryDataError,
} from "../redux/actions";
import { log, storage, requestUrl, buildQuery } from "../utils";
import axios from "axios";

/**
 * fetchQueryDataSaga
 */

function* fetchQueryDataSaga(action) {
  const apiKey = storage.pull(API_KEY_ID);
  const {
    payload: { query },
  } = action;

  yield delay(1000);
  yield put(fetchQueryDataPending({ query }));

  try {
    const request = yield call(
      axios.get,
      requestUrl(apiKey, buildQuery({ s: query }))
    );

    const { data: response } = request;

    /**
     * we handle 200 responses
     * that are considered errors
     * by the API
     */
    if ("Error" in response) {
      throw new Error(response.Error);
    }

    yield put(fetchQueryDataSuccess({ response }));
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
          timeOut: 4000,
        })
      );
    }

    // 'error' force-thrown from a 200 response
    else {
      // TODO
      // we don't surface to the UI some frequent errors

      if (
        // prettier-ignore
        [
          "not found",
          "too many"
        ].every(
          blacklistedItem =>
            !error.message.toLowerCase().includes(blacklistedItem)
        )
      ) {
        yield put(
          showNotif({
            message: `Error: ${error.message}`,
            timeOut: 4000,
          })
        );
      }
    }

    // fetchQueryDataError?

    // we print the error response
    // by default, or undefined
    yield put(fetchQueryDataError({ error: error.response || error.message }));
    console.error(error.response || error.message);
  }
}

/**
 * fetchQueryDataWatcher
 */

export default function* fetchQueryDataWatcher() {
  // yield throttle(2000, `${fetchQueryDataRequest}`, fetchQueryData);
  yield takeLatest(`${fetchQueryData}`, fetchQueryDataSaga);
}
