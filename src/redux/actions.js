/* ---------------------------------
actions
--------------------------------- */

import { createAction } from "@reduxjs/toolkit";

export const _test = createAction("TEST");
export const createToWatch = createAction("CREATE_TO_WATCH");
export const createWatched = createAction("CREATE_WATCHED");
export const deleteWatched = createAction("DELETE_WATCHED");
export const destroyUser = createAction("DESTROY_USER");
export const filterWatched = createAction("FILTER_WATCHED");
export const getUser = createAction("GET_USER");
export const hideNotif = createAction("HIDE_NOTIF");
export const initUser = createAction("INIT_USER");
export const setApiKey = createAction("SET_API_KEY");
export const setAuthState = createAction("SET_AUTH_STATE");
export const setInitialData = createAction("SET_INITIAL_DATA");
export const showNotif = createAction("SHOW_NOTIF");
export const toggleModal = createAction("TOGGLE_MODAL");
export const updateWatched = createAction("UPDATE_WATCHED");
export const fetchQueryDataRequest = createAction("FETCH_QUERY_DATA_REQUEST");
export const fetchQueryDataPending = createAction("FETCH_QUERY_DATA_PENDING");
export const fetchQueryDataSuccess = createAction("FETCH_QUERY_DATA_SUCCESS");
export const fetchQueryDataError = createAction("FETCH_QUERY_DATA_ERROR");
export const resetQueryData = createAction("RESET_QUERY_DATA");
