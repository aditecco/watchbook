/* ---------------------------------
App
--------------------------------- */

import React, { useState, useEffect } from "react";
import { storage } from "./utils";
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "./styles/index.scss";
import NotificationMessage from "./components/NotificationMessage/NotificationMessage";
import { log } from "./utils";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Modal from "./components/Modal/Modal";
import Spinner from "./components/Spinner/Spinner";
import { connect } from "react-redux";
import { initUser, setAuthState } from "./actions";
import Routes from "./components/Routes";

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
