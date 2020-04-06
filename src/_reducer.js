/* ---------------------------------
reducer
--------------------------------- */

import { createReducer } from "@reduxjs/toolkit";
import { log, storage } from "./utils";
import initialState from "./initialState";
import { TEST } from "./actions";

const _reducer = createReducer(initialState, {
  /*
  INIT_USER(state, action) {
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

  DESTROY_USER(state, action) {
    return {
      ...state,
      userData: {},
    };
  },

  SET_INITIAL_DATA(state, action) {
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

  SET_API_KEY(state, action) {
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

  GET_USER(state, action) {
    return state;
  },

  CREATE_WATCHED(state, action) {
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

  CREATE_TO_WATCH(state, action) {
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

  UPDATE_WATCHED(state, action) {
    return state;
  },

  DELETE_WATCHED(state, action) {
    return state;
  },

  FILTER_WATCHED(state, action) {
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

  SHOW_NOTIF(state, action) {
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

  HIDE_NOTIF(state, action) {
    return {
      ...state,
      notificationMessage: {
        ...initialState.notificationMessage,
      },
    };
  },

  TOGGLE_MODAL(state, action) {
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
  */

  [TEST](state, action) {
    log("@@@", action.type);
    return state;
  },
});

export default _reducer;
