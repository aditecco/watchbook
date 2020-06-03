/* ---------------------------------
rootSaga
--------------------------------- */

import { all } from "redux-saga/effects";
import fetchQueryDataWatcher from "./fetchQueryData";
import fetchAdditionalDataWatcher from "./fetchAdditionalData";
import createRemoteContentWatcher from "./createRemoteContent";
import refreshCardDataWatcher from "./refreshCardData";
import updateRemoteContentWatcher from "./updateRemoteContent";
import deleteContentWatcher from "./deleteContent";
import convertContentWatcher from "./convertContent";

export default function* rootSaga() {
  yield all([
    //
    convertContentWatcher(),
    createRemoteContentWatcher(),
    deleteContentWatcher(),
    fetchAdditionalDataWatcher(),
    fetchQueryDataWatcher(),
    refreshCardDataWatcher(),
    updateRemoteContentWatcher(),
    //
  ]);
}
