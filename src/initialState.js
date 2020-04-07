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
    message: "",
    icon: "",
    isVisible: false,
    timeOut: 0,
  },
  modal: {
    open: false,
    children: null,
    closeAction: null,
  },
};
