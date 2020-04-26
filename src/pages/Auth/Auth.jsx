/* ---------------------------------
Auth
--------------------------------- */

import React, { useReducer, useState } from "react";
import { log, storage, capitalize } from "../../utils";
import * as firebase from "firebase/app";
import "firebase/auth";
import { Redirect } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import TabSwitcher from "../../components/TabSwitcher/TabSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { showNotif } from "../../actions";

export const AuthForm = ({ action, actionHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="authForm">
      <label htmlFor="emailField">{`${capitalize(action)} email`}</label>
      <input
        id="emailField"
        name="emailField"
        type="text"
        className="BaseInput"
        placeholder={`${action}.email@example.com`}
        value={email}
        onChange={e => setEmail(e.currentTarget.value)}
      />

      <label htmlFor="passwordField">Password</label>
      <input
        id="passwordField"
        name="passwordField"
        type="password"
        className="BaseInput"
        placeholder="xyz"
        value={password}
        onChange={e => setPassword(e.currentTarget.value)}
      />

      <button
        type="button"
        className="BaseButton"
        onClick={() => actionHandler({ action, email, password })}
      >
        {capitalize(action)}
      </button>
    </form>
  );
};

export default function Auth() {
  const dispatch = useDispatch();
  const { authenticated } = useSelector(state => state.authentication);

  const initialComponentState = {
    hasError: { error: false, errorMeta: {} },
  };

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialComponentState
  );

  /**
   * handleAuth
   */

  async function handleAuth({ action, email, password }) {
    if (!validate({ email, password })) {
      window.alert("nope!");
      return;
    }

    try {
      await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL);

      if (action === "login") {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } else if (action === "signup") {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
      }

      setState(initialComponentState);

      dispatch(
        showNotif({
          message: `Welcome!`,
          icon: null,
          timeOut: 2000,
        })
      );
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
      case "400": {
        /**
         * EMAIL_NOT_FOUND
         * INVALID_PASSWORD
         */
        break;
      }

      default: {
        dispatch(
          showNotif({
            message: `${code}: ${message}`,
            icon: null,
            timeOut: 4000,
          })
        );

        log("@Auth", error);
        break;
      }
    }
  }

  return !authenticated ? (
    <Layout rootClass="Auth" hasNav={false}>
      <PageHeader title="Auth" icon="account_circle" />

      <div className="wrapper thin">
        <TabSwitcher
          tabs={[
            {
              name: "Login",
              content: <AuthForm action="login" actionHandler={handleAuth} />,
            },
            {
              name: "Signup",
              content: <AuthForm action="signup" actionHandler={handleAuth} />,
            },
          ]}
        />
      </div>
    </Layout>
  ) : (
    <Redirect to="/home" /> // TODO redirect to the page the user was visiting before being redirected here!
  );
}
