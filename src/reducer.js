/* ---------------------------------
reducer
--------------------------------- */

import { log, storage } from "./utils";
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
      const { uid } = action;

      return {
        ...state,
        userData: {
          [uid]: {
            ...userDataTemplate
          }
        }
      };
    }

    case "DESTROY_USER": {
      return {
        ...state,
        userData: {}
      };
    }

    case "SET_INITIAL_DATA": {
      const { uid, mappedData } = action;

      return {
        ...state,
        userData: {
          [uid]: {
            ...state.userData[uid],
            watched: mappedData.watched,
            toWatch: mappedData.toWatch
          }
        }
      };
    }

    case "SET_API_KEY": {
      const { key: apiKey, uid } = action;

      // return Object.assign({}, state, {
      //   userData: {
      //     [uid]: {
      //       settings: {
      //         apiKey
      //       }
      //     }
      //   }
      // });

      return {
        ...state,
        userData: {
          ...state.userData,
          [uid]: {
            ...state.userData[uid],
            settings: {
              apiKey
            }
          }
        }
      };
    }

    case "GET_USER": {
      return state;
    }

    case "CREATE_WATCHED": {
      const { watchedItem, uid } = action;

      return {
        ...state,
        userData: {
          [uid]: {
            ...state.userData[uid],
            watched: [watchedItem, ...state.userData[uid]["watched"]]
          }
        }
      };
    }

    case "CREATE_TO_WATCH": {
      const { toWatchItem, uid } = action;

      return {
        ...state,
        userData: {
          [uid]: {
            ...state.userData[uid],
            toWatch: [toWatchItem, ...state.userData[uid]["toWatch"]]
          }
        }
      };
    }

    case "UPDATE_WATCHED": {
      return state;
    }

    case "DELETE_WATCHED": {
      return state;
    }

    case "FILTER_WATCHED": {
      const { query, uid } = action;
      const lowercased = item => item.toLowerCase();
      const _query = lowercased(query);
      const result = state.userData[uid]["watched"].filter(item =>
        lowercased(item.title).includes(_query)
      );

      log(query);

      return {
        ...state,
        filter: result // TODO should this be in local state?
      };
    }

    case "SHOW_NOTIF": {
      const { message, icon, timeOut } = action;

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

    case "TOGGLE_MODAL": {
      const { children = null, closeAction = null } = action;

      return {
        ...state,
        modal: {
          open: !state.modal.open,
          children,
          closeAction
        }
      };
    }

    default:
      return state;
  }
}
