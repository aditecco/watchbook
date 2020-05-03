/* ---------------------------------
rootSaga
--------------------------------- */

import { all } from "redux-saga/effects";
import fetchQueryDataWatcher from "./fetchQueryData";
import fetchAdditionalDataWatcher from "./fetchAdditionalData";

export default function* rootSaga() {
  yield all([
    fetchQueryDataWatcher(),
    fetchAdditionalDataWatcher(),
    //
  ]);
}
