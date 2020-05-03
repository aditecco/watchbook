/* ---------------------------------
App
--------------------------------- */

import React, { useState, useEffect } from "react";
import * as firebase from "firebase/app";
import "./styles/index.scss";
import NotificationMessage from "./components/NotificationMessage/NotificationMessage";
import { log } from "./utils";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Modal from "./components/Modal/Modal";
import Spinner from "./components/Spinner/Spinner";
import { connect } from "react-redux";
import { initUser, setAuthState } from "./redux/actions";
import Routes from "./components/Routes";

/* ========================
function App
======================== */

function App({ auth, data, notification, modal, dispatch }) {
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
        <Routes />
        <NotificationMessage />
        <Modal />
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
