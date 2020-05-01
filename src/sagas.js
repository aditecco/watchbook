/* ---------------------------------
Sagas
--------------------------------- */

import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { API_KEY_ID } from "./constants";
import {
  showNotif,
  fetchQueryDataPending,
  fetchQueryDataSuccess,
  fetchQueryDataError,
} from "./actions";
import { log, storage, requestUrl, buildQuery } from "./utils";
import axios from "axios";

/**
 * fetchQueryData
 */

function* fetchQueryData(action) {
  const apiKey = storage.pull("d");
  const {
    payload: { query },
  } = action;

  yield put(fetchQueryDataPending());

  try {
    const request = yield call(
      () => axios.get(requestUrl(apiKey, buildQuery({ s: query }))),
      []
    );
    const { data: response } = request;

    if ("Error" in response) {
      if (!response.Error.toLowercase().includes === "not found") {
        yield put(
          showNotif({
            message: `${request.status} Error: ${response.Error}`,
            icon: null,
            timeOut: 4000,
          })
        );
      }

      throw new Error(response.Error);
    }

    yield put(fetchQueryDataSuccess({ response }));
  } catch (err) {
    // yield put(fetchQueryDataError({ err }));

    if ("response" in err) {
      const {
        status,
        data: { Error: message },
      } = err.response;

      yield put(
        showNotif({
          message: `${status} Error: ${message}`,
          icon: null,
          timeOut: 4000,
        })
      );
    }

    // we print the error response
    // by default, or undefined
    console.error(err.response);
  }
}

/**
 * s
 */

function* s() {
  yield takeLatest("FETCH_QUERY_DATA_REQUEST", fetchQueryData);
}

export default s;
