/* ---------------------------------
App
--------------------------------- */

import React, { useState, useReducer, useEffect } from "react";
import { storage } from "./utils";
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import initialState from "./initialState";
import reducer from "./reducer";
import Watched from "./pages/Watched/Watched";
import ToWatch from "./pages/ToWatch/ToWatch";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import Home from "./pages/Home/Home";
import BlankPage from "./pages/BlankPage";
import TestPage from "./pages/TestPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/index.scss";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Auth from "./pages/Auth/Auth";
import { initialAuthState } from "./initialAuthState";
import NotificationMessage from "./components/NotificationMessage/NotificationMessage";
import { log } from "./utils";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Modal from "./components/Modal/Modal";
import Spinner from "./components/Spinner/Spinner";
import { connect } from "react-redux";
import {
  _test,
  createToWatch,
  createWatched,
  deleteWatched,
  destroyUser,
  filterWatched,
  getUser,
  hideNotif,
  initUser,
  setApiKey,
  setAuthState,
  setInitialData,
  showNotif,
  toggleModal,
  updateWatched,
} from "./actions";

// global utils
window.storage = storage;

// firebase initializers
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.database();

// context initializers
export const StoreContext = React.createContext();
export const AuthContext = React.createContext();

/* ========================
function App
======================== */

function App({ auth, data, notification, modal, dispatch }) {
  /**
   * auth reducer
   */

  const [_authState, _setAuthState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialAuthState
  );

  /**
   * store reducer
   */

  const [_store, _dispatch] = useReducer(reducer, initialState);

  /**
   * loading state
   */

  const [loading, setLoading] = useState(true);

  /**
   * Auth observer
   */

  useEffect(() => {
    const observer = firebase.auth().onAuthStateChanged(
      user => {
        /**
         * user should be present in case of
         *  signup, login or persistent session
         */

        // prettier-ignore
        if (user)
        {
          log("@@@ user is present");
          
          const {
            uid, name, email, photoUrl, emailVerified,
          } = user;
          
          dispatch(setAuthState({
            authenticated: true,
            user: {
              uid, name, email, photoUrl, emailVerified,
            }
          }))
        }
        
        else
        {
          log("@@@, no user is present", user);
        }

        setLoading(false);
      },
      err => {
        console.error("@onAuthStateChanged", err);

        setLoading(false);
      }
    );

    return () => observer(); // this will unsubscribe from the obs.
  }, []);

  useEffect(() => {
    auth.authenticated && dispatch(initUser(auth.user));
  }, [auth]);

  return loading ? (
    <Spinner />
  ) : (
    <ErrorBoundary>
      <div className="App">
        <AuthContext.Provider value={[_authState, _setAuthState]}>
          <StoreContext.Provider value={[_store, _dispatch]}>
            <NotificationMessage />

            <Router>
              <Switch>
                <Route exact path="/">
                  <Auth />
                </Route>

                <PrivateRoute exact path="/home">
                  <Home />
                </PrivateRoute>

                <PrivateRoute exact path="/watched">
                  <Watched />
                </PrivateRoute>

                <PrivateRoute exact path="/to-watch">
                  <ToWatch />
                </PrivateRoute>

                <PrivateRoute exact path="/settings">
                  <Settings />
                </PrivateRoute>

                <PrivateRoute exact path="/profile">
                  <Profile />
                </PrivateRoute>

                {/* catch-all */}
                <Route
                  render={({ location }) => (
                    <BlankPage title="404" icon="wifi_off">
                      <h4>Sorry, nothing to see at {location.pathname}</h4>
                    </BlankPage>
                  )}
                />
              </Switch>
            </Router>
          </StoreContext.Provider>
        </AuthContext.Provider>

        <Modal open={modal.open} closeAction={modal.closeAction}>
          {modal.children}
        </Modal>
      </div>
    </ErrorBoundary>
  );
}

const mapState = state => ({
  auth: state.authentication,
  data: state.userData,
  notification: state.notificationMessage,
  modal: state.modal,
});

export default connect(mapState)(App);
