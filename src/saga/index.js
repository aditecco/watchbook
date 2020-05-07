/* ---------------------------------
rootSaga
--------------------------------- */

import { all } from "redux-saga/effects";
import fetchQueryDataWatcher from "./fetchQueryData";
import fetchAdditionalDataWatcher from "./fetchAdditionalData";
import createRemoteContentWatcher from "./createRemoteContent";
import refreshCardDataWatcher from "./refreshCardData";

export default function* rootSaga() {
  yield all([
    //
    fetchQueryDataWatcher(),
    fetchAdditionalDataWatcher(),
    createRemoteContentWatcher(),
    refreshCardDataWatcher(),
    //
  ]);
}
