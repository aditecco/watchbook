/* ---------------------------------
store
--------------------------------- */

export default {
  meta: {
    app: "WatchBook",
    version: `${process.env.REACT_APP_APP_VERSION}`,
    build: `${process.env.REACT_APP_APP_BUILD}`,
  },
  authentication: {
    authenticated: false,
    user: null,
  },
  userData: {},
  notificationMessage: {
    isVisible: false,
    message: "",
    icon: "",
    timeOut: 0,
  },
  modal: {
    open: false,
    content: undefined,
  },
};
