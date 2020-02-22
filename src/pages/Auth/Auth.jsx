/* ---------------------------------
Start
--------------------------------- */

import React, { useEffect, useReducer, useContext } from "react";
import { log, storage } from "../../utils";
import { API_KEY } from "../../constants";
import Modal from "../../components/Modal/Modal";
import * as firebase from "firebase/app";
import "firebase/auth";
import { AuthContext, StoreContext } from "../../App";
import { Redirect } from "react-router-dom";

export default function Auth() {
  const [{ authenticated }, setAuthState] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      signingUp: false,
      loggingIn: false,
      isAuthorized: false,
      keyIsPresent: false,
      showModal: false,
      hasError: { error: false, errorMeta: {} },
      // notifMessage: "",
      // notifIsVisible: false,
      email: "",
      password: ""
    }
  );

  const { showModal, email, password, loggingIn, signingUp } = state;

  /**
   * handleSignup
   */

  // function handleSignup(credentials) {
  //   const { email, password } = credentials;

  //   if (!validate(credentials)) {
  //     setState({ email: "", password: "" });
  //     window.alert("nope!");
  //     return;
  //   }

  //   firebase
  //     .auth()
  //     .createUserWithEmailAndPassword(email, password)
  //     .then(r => {
  //       log(r);
  //       return r;
  //     })
  //     .then(({ user }) => {
  //       const { email, uid } = user;

  //       log("new signup!");

  //       // showNotif("New signup!", 2000);

  //       setState({
  //         isAuthorized: true,
  //         showModal: false,
  //         loggingIn: false,
  //         email: "",
  //         password: ""
  //       });

  //       dispatch({ type: "INIT_USER", uid });

  //       dispatch({
  //         type: "SHOW_NOTIF",
  //         message: `Welcome, ${user.email}!`,
  //         icon: null,
  //         timeOut: 2000
  //       });

  //       setAuthState({ user: { email, uid }, authenticated: true });

  //       sessionStorage.setItem("WatchBookUserUID", uid);
  //     })
  //     .catch(handleError);
  // }

  /**
   * handleLogin
   */

  async function handleLogin(credentials) {
    const { email, password } = credentials;

    if (!validate(credentials)) {
      setState({ email: "", password: "" });
      window.alert("nope!");
      return;
    }

    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      if (loggingIn) {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } else if (signingUp) {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      }

      setState({
        isAuthorized: true,
        showModal: false,
        loggingIn: false,
        email: "",
        password: ""
      });

      // dispatch({ type: "INIT_USER", uid });

      dispatch({
        type: "SHOW_NOTIF",
        // message: `Welcome, ${user.email}!`,
        message: `Welcome!`,
        icon: null,
        timeOut: 2000
      });
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * validate
   */

  function validate(input) {
    return Object.values(input).every(val => val !== "");
  }

  /**
   * handleError
   */

  function handleError(error) {
    const { code, message } = error;

    setState({ hasError: { error: true, errorMeta: { code, message } } });

    switch (code) {
      case "400":
        // …
        break;

      default:
        break;
    }
  }

  /**
   * Checks for the required API key
   */

  function checkApiKey() {
    const storageID = API_KEY;
    const key = storage.pull(storageID);

    if (!key) {
      const requestKey = window.prompt("Please enter your API key.");

      if (!requestKey) {
        window.alert("No valid key was provided.");
        return;
      }

      storage.push(storageID, requestKey);
    }

    setState({ keyIsPresent: true });
  }

  return !authenticated ? (
    <main className="StartPage">
      {/* modal */}
      <Modal
        open={showModal}
        closeAction={() =>
          setState({ showModal: false, signingUp: false, loggingIn: false })
        }
      >
        <h3>{`${signingUp ? "Signup!" : "Login"}`}</h3>

        <form action="" className={`${signingUp ? "signupForm" : "loginForm"}`}>
          {signingUp ? (
            <>
              {/* signup */}
              <input
                type="text"
                className="signupEmail"
                placeholder="email"
                onChange={e => setState({ email: e.currentTarget.value })}
              />

              <input
                type="password"
                className="signupPassword"
                placeholder="password"
                onChange={e => setState({ password: e.currentTarget.value })}
              />

              <button type="button" className="signupButton" onClick={() => {}}>
                Signup
              </button>
            </>
          ) : (
            <>
              {/* login */}
              <input
                type="text"
                className="loginEmail"
                placeholder="email"
                onChange={e => setState({ email: e.currentTarget.value })}
              />

              <input
                type="password"
                className="loginPassword"
                placeholder="password"
                onChange={e => setState({ password: e.currentTarget.value })}
              />

              <button
                type="button"
                className="loginButton"
                onClick={() => handleLogin({ email, password })}
              >
                Login
              </button>
            </>
          )}
        </form>
      </Modal>

      {/* start page */}
      <div className="Start">
        <h3>Signup or login</h3>
        <button
          type="button"
          className="signupButton"
          onClick={() => setState({ showModal: true, signingUp: true })}
        >
          Signup
        </button>
        <button
          type="button"
          className="loginButton"
          onClick={() => setState({ showModal: true, loggingIn: true })}
        >
          Login
        </button>
      </div>
    </main>
  ) : (
    <Redirect to="/home" />
  );
}
