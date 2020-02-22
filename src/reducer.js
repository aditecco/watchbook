/* ---------------------------------
reducer
--------------------------------- */

import {
  log,
  storage
} from "./utils";
import initialState from "./initialState";

export const userDataTemplate = {
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
      const {
        uid
      } = action;

      return {
        ...state,
        userData: {
          [uid]: {
            ...userDataTemplate
          }
        }
      };
    }

    case "SET_INITIAL_DATA": {
      const {
        uid,
        value
      } = action;

      return {
        ...state,
        userData: {
          [uid]: {
            ...state.userData[uid],
            watched: value
          }
        }
      };
    }

    case "GET_USER": {
      const {
        uid
      } = action;

      return state;
    }

    case "CREATE_WATCHED": {
      const {
        payload
      } = action;

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
      const {
        payload
      } = action;
      const lc = item => item.toLowerCase();
      const query = lc(payload);
      const result = state.watched.filter(
        el => lc(el.title).indexOf(lc(query)) !== -1
      );

      log(query);

      return {
        ...state,
        filter: result
      };
    }

    case "SHOW_NOTIF": {
      const {
        message,
        icon,
        timeOut
      } = action;

      return {
        ...state,
        notificationMessage: {
          isVisible: true,
          message,
          icon,
          timeOut
        }
      };
    }

    case "HIDE_NOTIF": {
      return {
        ...state,
        notificationMessage: {
          ...initialState.notificationMessage
        }
      };
    }

    default:
      return state;
  }
}
