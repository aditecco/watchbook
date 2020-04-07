/* ---------------------------------
actions
--------------------------------- */

import { createAction } from "@reduxjs/toolkit";

export const test = createAction("TEST");
export const initUser = createAction("INIT_USER");
export const destroyUser = createAction("DESTROY_USER");
export const setInitialData = createAction("SET_INITIAL_DATA");
export const setApiKey = createAction("SET_API_KEY");
export const getUser = createAction("GET_USER");
export const createWatched = createAction("CREATE_WATCHED");
export const createToWatch = createAction("CREATE_TO_WATCH");
export const updateWatched = createAction("UPDATE_WATCHED");
export const deleteWatched = createAction("DELETE_WATCHED");
export const filterWatched = createAction("FILTER_WATCHED");
export const showNotif = createAction("SHOW_NOTIF");
export const hideNotif = createAction("HIDE_NOTIF");
export const toggleModal = createAction("TOGGLE_MODAL");
