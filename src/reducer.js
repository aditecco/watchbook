/* ---------------------------------
reducer
--------------------------------- */

import { log, storage } from "./utils";

export default function reducer(state, action) {
  switch (action.type) {
    case "INIT_USER": {
      const { payload } = action;

      log("INIT_USER");
      storage.push("WatchBookUserUID", payload);

      return {
        ...state,
        users: {
          ...state.users,
          [payload]: {
            watched: [],
            toWatch: []
          }
        }
      };
    }

    case "SET_INITIAL_DATA": {
      const { payload } = action;

      log("SET_INITIAL_DATA");

      return {
        ...state,
        users: {
          ...state.users,
          [payload.uid]: {
            ...state.users[payload.uid],
            watched: payload.value
          }
        }
      };
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
