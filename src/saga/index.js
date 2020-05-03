/* ---------------------------------
rootSaga
--------------------------------- */

import { all } from "redux-saga/effects";
import fetchQueryDataWatcher from "./fetchQueryData";

export default function* rootSaga() {
  yield all([
    fetchQueryDataWatcher(),
    //
  ]);
}
