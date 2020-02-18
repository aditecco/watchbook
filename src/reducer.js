/* ---------------------------------
reducer
--------------------------------- */

import { log, storage } from "./utils";

export const userState = {
  watched: [],
  toWatch: [],
  settings: {
    apiKey: ""
  }
};

export default function reducer(state, action) {
  log(action.type);

  switch (action.type) {
    case "INIT_USER": {
      const { uid } = action;

      return {
        ...state,
        users: {
          [uid]: {
            ...userState
          }
        }
      };
    }

    case "SET_INITIAL_DATA": {
      const { uid, value } = action;

      return {
        ...state,
        users: {
          [uid]: {
            ...state.users[uid],
            watched: value
          }
        }
      };
    }

    case "GET_USER": {
      const { uid } = action;

      return state;
    }

    case "CREATE_WATCHED": {
      const { payload } = action;

      return {
        ...state,
        watched: [payload, ...state.watched]
      };
    }

    case "UPDATE_WATCHED": {
      const { payload } = action;

      return state;
    }

    case "DELETE_WATCHED": {
      const { payload } = action;

      log("DELETE_WATCHED");

      return state;
    }

    case "FILTER_WATCHED": {
      const { payload } = action;
      const lc = item => item.toLowerCase();
      const query = lc(payload);
      const result = state.watched.filter(
        el => lc(el.title).indexOf(lc(query)) !== -1
      );

      log(query);

      return { ...state, filter: result };
    }

    default:
      return state;
  }
}
