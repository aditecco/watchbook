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

export default function Start() {
  const [{ authenticated }, setIsAuthenticated] = useContext(AuthContext);
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

  const {
    isAuthorized,
    keyIsPresent,
    showModal,
    email,
    password,
    signingUp,
    loggingIn
    // notifMessage,
    // notifIsVisible
  } = state;

  /**
   * handleSignup
   */

  function handleSignup(credentials) {
    const { email, password } = credentials;

    if (!validate(credentials)) {
      setState({ email: "", password: "" });
      window.alert("nope!");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(r => {
        log(r);
        return r;
      })
      .then(({ user }) => {
        const { email, uid } = user;

        log("new signup!");

        // showNotif("New signup!", 2000);

        setState({
          isAuthorized: true,
          showModal: false,
          loggingIn: false,
          email: "",
          password: ""
        });

        dispatch({ type: "INIT_USER", uid });

        dispatch({
          type: "SHOW_NOTIF",
          message: `Welcome, ${user.email}!`,
          icon: null,
          timeOut: 2000
        });

        setIsAuthenticated({ user: { email, uid }, authenticated: true });

        sessionStorage.setItem("WatchBookUserUID", uid);
      })
      .catch(handleError);
  }

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

      await firebase.auth().signInWithEmailAndPassword(email, password);

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

  function handleSignout(e) {
    e.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(() => log("signed out!"))
      .catch(handleError);

    setState({ isAuthorized: false });
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

  return (
    <main className="StartPage">
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

              <button
                type="button"
                className="signupButton"
                onClick={() => handleSignup({ email, password })}
              >
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

      <button type="button" onClick={handleSignout}>
        signout
      </button>
    </main>
  );
}
