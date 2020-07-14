/* ---------------------------------
reducer
--------------------------------- */

import { createReducer } from "@reduxjs/toolkit";
import { log, clipText } from "../utils";
import initialState from "./initialState";
import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../constants";
import {
  convertContentError,
  convertContentPending,
  convertContentSuccess,
  createNotePending,
  createNoteSuccess,
  createNoteError,
  createRatingPending,
  createRatingSuccess,
  createRatingError,
  createRemoteContentError,
  createRemoteContentPending,
  createRemoteContentSuccess,
  createToWatch,
  createWatched,
  deleteContentError,
  deleteContentPending,
  deleteContentSuccess,
  deleteLocalContent,
  destroyUser,
  fetchQueryDataError,
  fetchQueryDataPending,
  fetchQueryDataSuccess,
  filterWatched,
  getUser,
  hideNotif,
  initUser,
  refreshCardDataError,
  refreshCardDataPending,
  refreshCardDataSuccess,
  resetQueryData,
  setApiKey,
  setAuthState,
  setInitialData,
  showNotif,
  toggleModal,
  updateLocalContent,
  updateRemoteContentError,
  updateRemoteContentPending,
  updateRemoteContentSuccess,
} from "./actions";

const userDataTemplate = {
  watched: [],
  toWatch: [],
  settings: {
    apiKey: "",
  },
};

const reducer = createReducer(initialState, {
  // @ts-ignore
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

  // @ts-ignore
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

  // @ts-ignore
  [destroyUser](state) {
    return {
      ...state,
      authentication: { authenticated: false, user: null },
      userData: {},
    };
  },

  // @ts-ignore
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

  // @ts-ignore
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

  // @ts-ignore
  [getUser](state, action) {
    return state;
  },

  // @ts-ignore
  [createWatched](state, action) {
    const {
      payload: { watchedItem, uid },
    } = action;

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],
          watched: [watchedItem, ...state.userData[uid][PRIMARY_DATASET_KEY]],
        },
      },
    };
  },

  // @ts-ignore
  [createToWatch](state, action) {
    const {
      payload: { toWatchItem, uid },
    } = action;

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],
          toWatch: [toWatchItem, ...state.userData[uid][SECONDARY_DATASET_KEY]],
        },
      },
    };
  },

  // @ts-ignore
  [updateLocalContent](state, action) {
    const {
      payload: { uid, contentType, updatedContent },
    } = action;

    const where = state.userData[uid][contentType].findIndex(
      el => el.id === updatedContent.id
    );

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],
          // prettier-ignore
          [contentType]: [
            ...state.userData[uid][contentType].slice(0, where),
            {
              ...state.userData[uid][contentType][where],
              ...updatedContent,
            },
            ...state.userData[uid][contentType].slice(where + 1),
          ]
        },
      },
    };
  },

  // @ts-ignore
  [filterWatched](state, action) {
    const {
      payload: { query, uid },
    } = action;
    const lowercased = item => item.toLowerCase();
    const _query = lowercased(query);
    const result = state.userData[uid][PRIMARY_DATASET_KEY].filter(item =>
      lowercased(item.title).includes(_query)
    );

    log(query);

    return {
      ...state,
      filter: result, // TODO should this be in local state?
    };
  },

  // @ts-ignore
  [showNotif](state, action) {
    const {
      payload: { message, icon, timeOut, theme = "dark" },
    } = action;

    return {
      ...state,
      notificationMessage: {
        isVisible: true,
        message: clipText(message, 25),
        icon,
        timeOut,
        theme,
      },
    };
  },

  // @ts-ignore
  [hideNotif](state) {
    return {
      ...state,
      notificationMessage: {
        ...initialState.notificationMessage,
      },
    };
  },

  // @ts-ignore
  [toggleModal](state, action) {
    return {
      ...state,
      modal: {
        forceOpen: (action.payload && action.payload.forceOpen) || false,
        open: state.modal.forceOpen ? true : !state.modal.open,
        content: (action.payload && action.payload.content) || null,
      },
    };
  },

  // @ts-ignore
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
        resetSignal: false,
      },
    };
  },

  // @ts-ignore
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

  // @ts-ignore
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

  // @ts-ignore
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
        resetSignal: true,
      },
    };
  },

  // @ts-ignore
  [createRemoteContentPending](state) {
    return {
      ...state,
      apiData: {
        ...state.apiData,
        fetching: true,
        resetSignal: false,
      },
    };
  },

  // @ts-ignore
  [createRemoteContentSuccess](state) {
    return {
      ...state,
      apiData: {
        ...state.apiData,
        fetching: false,
      },
    };
  },

  // @ts-ignore
  [createRemoteContentError](state, action) {
    // TODO avoid duplication with fetchQueryDataError
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

  // @ts-ignore
  [refreshCardDataPending](state) {
    return {
      ...state,
      apiData: {
        ...state.apiData,
        cardData: {
          ...state.apiData.cardData,
          fetching: true,
          data: null,
          updateSignal: "",
        },
      },
    };
  },

  // @ts-ignore
  [refreshCardDataSuccess](state, action) {
    const { payload: data } = action;

    return {
      ...state,
      apiData: {
        ...state.apiData,
        cardData: {
          ...state.apiData.cardData,
          fetching: false,
          data,
        },
      },
    };
  },

  // @ts-ignore
  [refreshCardDataError](state) {
    return state;
  },

  // @ts-ignore
  [updateRemoteContentPending](state) {
    return {
      ...state,
      apiData: {
        ...state.apiData,
        dbData: {
          ...state.apiData.dbData,
          fetching: true,
        },
      },
    };
  },

  // @ts-ignore
  [updateRemoteContentSuccess](state) {
    return {
      ...state,
      apiData: {
        ...state.apiData,
        dbData: {
          ...state.apiData.dbData,
          fetching: false,
        },
      },
    };
  },

  // @ts-ignore
  [updateRemoteContentError](state, action) {
    console.error(action.payload.error);

    return state;
  },

  // @ts-ignore
  [deleteContentPending](state, action) {
    return state;
  },

  // @ts-ignore
  [deleteContentError](state, action) {
    return state;
  },

  // @ts-ignore
  [deleteContentSuccess](state, action) {
    return state;
  },

  // @ts-ignore
  [deleteLocalContent](state, action) {
    const {
      payload: { uid, contentType, key },
    } = action;

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],
          [contentType]: [
            ...state.userData[uid][contentType].filter(el => el.key !== key),
          ],
        },
      },
    };
  },

  // @ts-ignore
  [convertContentPending](state, action) {
    return state;
  },

  // @ts-ignore
  [convertContentError](state, action) {
    return state;
  },

  // @ts-ignore
  [convertContentSuccess](state, action) {
    const {
      payload: { uid, from, to, key },
    } = action;

    const convertedItem = state.userData[uid][from].find(el => el.key === key);

    return {
      ...state,
      userData: {
        [uid]: {
          ...state.userData[uid],

          [from]: [...state.userData[uid][from].filter(el => el.key !== key)],

          [to]: [convertedItem, ...state.userData[uid][to]],
        },
      },
    };
  },

  // @ts-ignore
  [createNotePending](state, action) {
    return state;
  },

  // @ts-ignore
  [createNoteSuccess](state, action) {
    return state;
  },

  // @ts-ignore
  [createNoteError](state, action) {
    return state;
  },

  // @ts-ignore
  [createRatingPending](state, action) {
    return state;
  },

  // @ts-ignore
  [createRatingSuccess](state, action) {
    return state;
  },

  // @ts-ignore
  [createRatingError](state, action) {
    return state;
  },

  // end
});

export default reducer;
