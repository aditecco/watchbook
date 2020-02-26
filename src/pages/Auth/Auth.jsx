/* ---------------------------------
Auth
--------------------------------- */

import React, { useReducer, useContext } from "react";
import { log, storage } from "../../utils";
import * as firebase from "firebase/app";
import "firebase/auth";
import { AuthContext, StoreContext } from "../../App";
import { Redirect } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";

export default function Auth() {
  const [{ authenticated }] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);

  const initialComponentState = {
    loggingIn: true,
    signingUp: false,
    email: "",
    password: "",
    hasError: { error: false, errorMeta: {} }
  };

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialComponentState
  );

  const { email, password, loggingIn, signingUp } = state;

  /**
   * handleAuth
   */

  async function handleAuth() {
    if (!validate({ email, password })) {
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

      setState(initialComponentState);

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

  return !authenticated ? (
    <Layout rootClass="Auth" hasNav={false}>
      <PageHeader title="Auth" icon="account_circle" />

      {/* tabs */}
      <div className="tabUI">
        <button
          type="button"
          className="loginTabButton"
          onClick={() => setState({ loggingIn: true, signingUp: false })}
        >
          Login
        </button>

        <span> or </span>

        <button
          type="button"
          className="signupTabButton"
          onClick={() => setState({ loggingIn: false, signingUp: true })}
        >
          Signup
        </button>
      </div>

      {/* form */}
      <form className="authForm">
        <h3 className="authFormHeader">{loggingIn ? "Login" : "Signup"}</h3>

        {/* <label htmlFor="emailField">email</label> */}
        <input
          id="emailField"
          type="text"
          className="email"
          placeholder="email@example.com"
          value={email}
          onChange={e => setState({ email: e.currentTarget.value })}
        />

        {/* <label htmlFor="passwordField">password</label> */}
        <input
          id="passwordField"
          type="password"
          className="password"
          placeholder="xyz"
          value={password}
          onChange={e => setState({ password: e.currentTarget.value })}
        />

        <button type="button" className="Button" onClick={handleAuth}>
          {loggingIn ? "Login" : "Signup"}
        </button>
      </form>
    </Layout>
  ) : (
    <Redirect to="/home" />
  );
}
