/* ---------------------------------
reducer
--------------------------------- */

import { createReducer } from "@reduxjs/toolkit";
import { log, storage } from "./utils";
import initialState from "./initialState";
import {
  test,
  initUser,
  destroyUser,
  setInitialData,
  setApiKey,
  getUser,
  createWatched,
  createToWatch,
  updateWatched,
  deleteWatched,
  filterWatched,
  showNotif,
  hideNotif,
  toggleModal,
} from "./actions";

const userDataTemplate = {
  watched: [],
  toWatch: [],
  settings: {
    apiKey: "",
  },
};

const _reducer = createReducer(initialState, {
  [initUser](state, action) {
    const { uid } = action;

    return {
      ...state,
      userData: {
        [uid]: {
          ...userDataTemplate,
        },
      },
    };
  },

  [destroyUser](state, action) {
    return {
      ...state,
      userData: {},
    };
  },

  [setInitialData](state, action) {
    const { uid, mappedData } = action;

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],
          watched: [...mappedData.watched].reverse(),
          toWatch: [...mappedData.toWatch].reverse(),
        },
      },
    };
  },

  [setApiKey](state, action) {
    const { key: apiKey, uid } = action;

    return {
      ...state,
      userData: {
        ...state.userData,
        [uid]: {
          ...state.userData[uid],
          settings: {
            apiKey,
          },
        },
      },
    };
  },

  [getUser](state, action) {
    return state;
  },

  [createWatched](state, action) {
    const { watchedItem, uid } = action;

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],
          watched: [watchedItem, ...state.userData[uid]["watched"]],
        },
      },
    };
  },

  [createToWatch](state, action) {
    const { toWatchItem, uid } = action;

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],
          toWatch: [toWatchItem, ...state.userData[uid]["toWatch"]],
        },
      },
    };
  },

  [updateWatched](state, action) {
    return state;
  },

  [deleteWatched](state, action) {
    return state;
  },

  [filterWatched](state, action) {
    const { query, uid } = action;
    const lowercased = (item) => item.toLowerCase();
    const _query = lowercased(query);
    const result = state.userData[uid]["watched"].filter((item) =>
      lowercased(item.title).includes(_query)
    );

    log(query);

    return {
      ...state,
      filter: result, // TODO should this be in local state?
    };
  },

  [showNotif](state, action) {
    const { message, icon, timeOut } = action;

    return {
      ...state,
      notificationMessage: {
        isVisible: true,
        message,
        icon,
        timeOut,
      },
    };
  },

  [hideNotif](state, action) {
    return {
      ...state,
      notificationMessage: {
        ...initialState.notificationMessage,
      },
    };
  },

  [toggleModal](state, action) {
    const { children = null, closeAction = null } = action;

    return {
      ...state,
      modal: {
        open: !state.modal.open,
        children,
        closeAction,
      },
    };
  },

  [test](state, action) {
    log("@@@", action.payload);
    return state;
  },
});

export default _reducer;
