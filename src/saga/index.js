/* ---------------------------------
rootSaga
--------------------------------- */

import { all } from "redux-saga/effects";
import fetchQueryDataWatcher from "./fetchQueryData";
import fetchAdditionalDataWatcher from "./fetchAdditionalData";
import createRemoteContentWatcher from "./createRemoteContent";

export default function* rootSaga() {
  yield all([
    //
    fetchQueryDataWatcher(),
    fetchAdditionalDataWatcher(),
    createRemoteContentWatcher(),
    //
  ]);
}
