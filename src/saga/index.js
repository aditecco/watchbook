/* ---------------------------------
rootSaga
--------------------------------- */

import { all } from "redux-saga/effects";
import fetchQueryDataWatcher from "./fetchQueryData";
import fetchAdditionalDataWatcher from "./fetchAdditionalData";
import createRemoteContentWatcher from "./createRemoteContent";
import refreshCardDataWatcher from "./refreshCardData";
import updateRemoteContentWatcher from "./updateRemoteContent";

export default function* rootSaga() {
  yield all([
    //
    createRemoteContentWatcher(),
    fetchAdditionalDataWatcher(),
    fetchQueryDataWatcher(),
    refreshCardDataWatcher(),
    updateRemoteContentWatcher(),
    //
  ]);
}
