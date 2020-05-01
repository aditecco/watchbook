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
import { storage, requestUrl, buildQuery } from "./utils";
import axios from "axios";

const apiKey = storage.pull(API_KEY_ID);

/**
 * fetchQueryData
 */

function* fetchQueryData(action) {
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
      /**
       * TODO
       *
       * very WIP
       * prevent multiple notifs to be fired
       * could use hasError: false in state
       * to lock searches until the error
       * is resolved
       */

      if (!response.Error.includes === "not found") {
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
    yield put(fetchQueryDataError({ err }));
  }
}

/**
 * s
 */

function* s() {
  yield takeLatest("FETCH_QUERY_DATA_REQUEST", fetchQueryData);
}

export default s;
