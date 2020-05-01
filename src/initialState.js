/* ---------------------------------
store
--------------------------------- */

export default {
  meta: {
    app: "WatchBook",
    version: `${process.env.REACT_APP_APP_VERSION}`,
    build: `${process.env.BUILD_ID}`, // will be resolved by Netlify
  },
  authentication: {
    authenticated: false,
    user: null,
  },
  userData: {},
  apiData: {
    loading: false,
    query: "",
    data: null,
    error: null,
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
    content: undefined,
  },
};
