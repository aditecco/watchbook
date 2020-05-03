/* ---------------------------------
reducer
--------------------------------- */

import { createReducer } from "@reduxjs/toolkit";
import { log } from "../utils";
import initialState from "./initialState";
import {
  createToWatch,
  createWatched,
  deleteWatched,
  destroyUser,
  filterWatched,
  getUser,
  hideNotif,
  initUser,
  setApiKey,
  setAuthState,
  setInitialData,
  showNotif,
  toggleModal,
  updateWatched,
  fetchQueryDataPending,
  fetchQueryDataError,
  fetchQueryDataSuccess,
  resetQueryData,
} from "./actions";

const userDataTemplate = {
  watched: [],
  toWatch: [],
  settings: {
    apiKey: "",
  },
};

const reducer = createReducer(initialState, {
  [setAuthState](state, action) {
    const {
      payload: { authenticated, user },
    } = action;

    return {
      ...state,
      authentication: {
        ...state.authentication,
        authenticated,
        user,
      },
    };
  },

  [initUser](state, action) {
    const { uid } = action.payload;

    return {
      ...state,
      userData: {
        [uid]: {
          ...userDataTemplate,
        },
      },
    };
  },

  [destroyUser](state) {
    return {
      ...state,
      authentication: { authenticated: false, user: null },
      userData: {},
    };
  },

  [setInitialData](state, action) {
    const {
      payload: { uid, mappedData },
    } = action;

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
    const {
      payload: { key: apiKey, uid },
    } = action;

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
    const {
      payload: { watchedItem, uid },
    } = action;

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
    const {
      payload: { toWatchItem, uid },
    } = action;

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
    const {
      payload: { query, uid },
    } = action;
    const lowercased = item => item.toLowerCase();
    const _query = lowercased(query);
    const result = state.userData[uid]["watched"].filter(item =>
      lowercased(item.title).includes(_query)
    );

    log(query);

    return {
      ...state,
      filter: result, // TODO should this be in local state?
    };
  },

  [showNotif](state, action) {
    const {
      payload: { message, icon, timeOut, theme = "dark" },
    } = action;

    return {
      ...state,
      notificationMessage: {
        isVisible: true,
        message,
        icon,
        timeOut,
        theme,
      },
    };
  },

  [hideNotif](state) {
    return {
      ...state,
      notificationMessage: {
        ...initialState.notificationMessage,
      },
    };
  },

  [toggleModal](state, action) {
    return {
      ...state,
      modal: {
        open: !state.modal.open,
        content: action.payload ? action.payload.content : null,
      },
    };
  },

  [fetchQueryDataPending](state, action) {
    const {
      payload: { query },
    } = action;

    return {
      ...state,
      apiData: {
        ...state.apiData,
        fetching: true,
        query,
        data: null,
        error: null,
      },
    };
  },

  [fetchQueryDataSuccess](state, action) {
    const {
      payload: { response: data },
    } = action;

    return {
      ...state,
      apiData: {
        ...state.apiData,
        fetching: false,
        data,
      },
    };
  },

  [fetchQueryDataError](state, action) {
    const {
      payload: { error },
    } = action;

    return {
      ...state,
      apiData: {
        ...state.apiData,
        fetching: false,
        error,
      },
    };
  },

  [resetQueryData](state) {
    return {
      ...state,
      apiData: {
        // not really necessary to clone,
        // but I could add new props
        // in the future
        ...state.apiData,
        fetching: false,
        query: "",
        data: null,
        error: null,
      },
    };
  },

  // end
});

export default reducer;
