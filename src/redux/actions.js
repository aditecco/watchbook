/* ---------------------------------
actions
--------------------------------- */

import { createAction } from "@reduxjs/toolkit";

export const _test = createAction("TEST");
export const createRemoteContent = createAction("CREATE_REMOTE_CONTENT");
export const createRemoteContentError = createAction("CREATE_REMOTE_CONTENT_ERROR");
export const createRemoteContentPending = createAction("CREATE_REMOTE_CONTENT_PENDING");
export const createRemoteContentSuccess = createAction("CREATE_REMOTE_CONTENT_SUCCESS");
export const createToWatch = createAction("CREATE_TO_WATCH");
export const createWatched = createAction("CREATE_WATCHED");
export const deleteContent = createAction("DELETE_CONTENT");
export const deleteContentError = createAction("DELETE_CONTENT_ERROR");
export const deleteContentPending = createAction("DELETE_CONTENT_PENDING");
export const deleteContentSuccess = createAction("DELETE_CONTENT_SUCCESS");
export const destroyUser = createAction("DESTROY_USER");
export const fetchAdditionalData = createAction("FETCH_ADDITIONAL_DATA");
export const fetchQueryData = createAction("FETCH_QUERY_DATA");
export const fetchQueryDataError = createAction("FETCH_QUERY_DATA_ERROR");
export const fetchQueryDataPending = createAction("FETCH_QUERY_DATA_PENDING");
export const fetchQueryDataSuccess = createAction("FETCH_QUERY_DATA_SUCCESS");
export const filterWatched = createAction("FILTER_WATCHED");
export const getUser = createAction("GET_USER");
export const hideNotif = createAction("HIDE_NOTIF");
export const initUser = createAction("INIT_USER");
export const refreshCardData = createAction("REFRESH_CARD_DATA");
export const refreshCardDataError = createAction("REFRESH_CARD_DATA_ERROR");
export const refreshCardDataPending = createAction("REFRESH_CARD_DATA_PENDING");
export const refreshCardDataSuccess = createAction("REFRESH_CARD_DATA_SUCCESS");
export const resetQueryData = createAction("RESET_QUERY_DATA");
export const setApiKey = createAction("SET_API_KEY");
export const setAuthState = createAction("SET_AUTH_STATE");
export const setInitialData = createAction("SET_INITIAL_DATA");
export const showNotif = createAction("SHOW_NOTIF");
export const toggleModal = createAction("TOGGLE_MODAL");
export const updateLocalContent = createAction("UPDATE_LOCAL_CONTENT");
export const updateRemoteContent = createAction("UPDATE_REMOTE_CONTENT");
export const updateRemoteContentError = createAction("UPDATE_REMOTE_CONTENT_ERROR");
export const updateRemoteContentPending = createAction("UPDATE_REMOTE_CONTENT_PENDING");
export const updateRemoteContentSuccess = createAction("UPDATE_REMOTE_CONTENT_SUCCESS");
