/* ---------------------------------
initialState
--------------------------------- */

export default {
  meta: {
    app: "WatchBook",
    version: `${process.env.REACT_APP_APP_VERSION}`,
    build: `${process.env.BUILD_ID}`, // will be resolved by Netlify
    source: `${process.env.REACT_APP_APP_SOURCE}`,
  },
  authentication: {
    authenticated: false,
    user: null,
  },
  userData: {},
  // TODO rename 'remoteData'
  // remoteData { contentSearch: {...}, additionalData: {...} }
  apiData: {
    fetching: false,
    query: "",
    data: null,
    error: null,
    resetSignal: false,
    dbData: {
      fetching: false,
      query: "",
      data: null,
      error: null,
    },
    cardData: {
      fetching: false,
      updateSignal: "",
      data: null,
      error: null,
    },
  },
  notificationMessage: {
    isVisible: false,
    message: "",
    icon: "",
    timeOut: 0,
    theme: "",
  },
  modal: {
    open: false,
    content: null,
    forceOpen: false,
  },
};
