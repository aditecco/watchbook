/* ---------------------------------
reducer
--------------------------------- */

import { log } from "./utils";

export default function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case "CREATE_WATCHED": {
      return {
        ...state,
        watched: [payload, ...state.watched]
      };
    }

    case "UPDATE_WATCHED": {
      return state;
    }

    case "DELETE_WATCHED": {
      return state;
    }

    case "FILTER_WATCHED": {
      const lc = item => item.toLowerCase();
      const query = lc(payload);
      const result = state.watched.filter(
        el => lc(el.title).indexOf(lc(query)) !== -1
      );

      log(query);

      return { ...state, filter: result };
    }

    case "SET_INITIAL_DATA": {
      log("SET_INITIAL_DATA", {
        ...state,
        ...payload
      });

      return {
        ...state,
        ...payload
      };
    }

    default:
      return state;
  }
}
