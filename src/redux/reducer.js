/* ---------------------------------
reducer
--------------------------------- */

import { createReducer } from "@reduxjs/toolkit";
import { log } from "../utils";
import initialState from "./initialState";
import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../constants";
import {
  convertContentError,
  convertContentPending,
  convertContentSuccess,
  createNotePending,
  createNoteSuccess,
  createNoteError,
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
          watched: [watchedItem, ...state.userData[uid][PRIMARY_DATASET_KEY]],
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
          toWatch: [toWatchItem, ...state.userData[uid][SECONDARY_DATASET_KEY]],
        },
      },
    };
  },

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
        resetSignal: false,
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
        resetSignal: true,
      },
    };
  },

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

  [createRemoteContentSuccess](state) {
    return {
      ...state,
      apiData: {
        ...state.apiData,
        fetching: false,
      },
    };
  },

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

  [refreshCardDataError](state) {
    return state;
  },

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

  [updateRemoteContentError](state, action) {
    console.error(action.payload.error);

    return state;
  },

  [deleteContentPending](state, action) {
    return state;
  },

  [deleteContentError](state, action) {
    return state;
  },

  [deleteContentSuccess](state, action) {
    return state;
  },

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

  [convertContentPending](state, action) {
    return state;
  },

  [convertContentError](state, action) {
    return state;
  },

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

  [createNotePending](state, action) {
    return state;
  },

  [createNoteSuccess](state, action) {
    return state;
  },

  [createNoteError](state, action) {
    return state;
  },

  // end
});

export default reducer;

/*
{
  type: "UPDATE_LOCAL_CONTENT",
  payload: {
    uid: 'ejcZFplCYHcaASxQ9VRRCFLEpG53',
    contentType: 'watched',
    id: '00523025-e430-4a17-aa2c-57f33fe687c2',
    updatedContent: { title: 'no' }
  },
}
*/
