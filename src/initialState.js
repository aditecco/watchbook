/* ---------------------------------
store
--------------------------------- */

export default {
  meta: {
    app: "WatchBook",
    version: "v0.0.0",
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
