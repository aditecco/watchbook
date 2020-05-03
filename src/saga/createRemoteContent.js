/* ---------------------------------
createRemoteContent
--------------------------------- */

import React from "react";
import { call, put, takeEvery, delay, select } from "redux-saga/effects";
import { API_KEY_ID } from "../constants";
import {
  showNotif,
  fetchAdditionalData,
  toggleModal,
  createRemoteContent,
} from "../redux/actions";
import { log, storage, requestUrl, buildQuery } from "../utils";
import axios from "axios";
import Card from "../components/Card/Card";

/**
 * createContent
 */

const apiKey = storage.pull(API_KEY_ID);

function* createRemoteContentSaga(action) {
  // const newItemRef = contentRef.push().key;
  // const updates = {
  //   [`/content/${newItemRef}`]: newItem,
  //   [`/users/${uid}/toWatch/${newItemRef}`]: true,
  // };
  // dbRef.update(updates, err => {
  //   if (err) {
  //     // TODO handle error
  //     console.error(err);
  //   } else {
  //     dispatch(toggleModal());
  //     dispatch(
  //       showNotif({
  //         message: `To Watch: ${newItem.title}`,
  //         icon: <MaterialIcon icon="bookmark" />,
  //         timeOut: 2000,
  //         theme: "light",
  //       })
  //     );
  //   }
  // });
}

/**
 * createContentWatcher
 */

export default function* createRemoteContentWatcher() {
  yield takeEvery(`${createRemoteContent}`, createRemoteContentSaga);
}
