/* ---------------------------------
Start
--------------------------------- */

import React, { useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
import { log, storage } from "../../utils";
import { API_KEY } from "../../constants";
import Modal from "../../components/Modal/Modal";

import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../config/firebaseConfig";

export default function Start() {
  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    {
      signingUp: false,
      loggingIn: false,
      isAuthorized: false,
      keyIsPresent: false,
      showModal: false,
      hasError: { error: false, errorMeta: {} },
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
  } = state;

  // const [isAuthorized, setIsAuthorized] = useState(false);
  // const [keyIsPresent, setKeyIsPresent] = useState(false);
  // const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // checkApiKey()
  }, []);

  /**
   * xyz
   */

  function handleSignup(credentials) {
    const { email, password } = credentials;

    if (!email || !password) {
      window.alert("nope!");
      return;
    }

    // provide some form of validation

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({ users }) => {
        const [newUser] = users;

        log("new signup!");

        setState({ email: "", password: "" });
      })
      .catch(error => {
        const { code, message } = error;
        setState({ hasError: { error: true, errorMeta: { code, message } } });
      });
  }

  /**
   * xyz
   */

  function handleLogin(credentials) {
    const { email, password } = credentials;

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        log("new login");

        setState({ isAuthorized: true, showModal: false, loggingIn: false });
      })
      .catch(error => {
        const { code, message } = error;
        setState({ hasError: { error: true, errorMeta: { code, message } } });
      });
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
    <>
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
                style={{ color: "white" }} // remove
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
                style={{ color: "white" }} // remove
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

        {isAuthorized && keyIsPresent && <Link to="/home">Home</Link>}
      </div>
    </>
  );
}
