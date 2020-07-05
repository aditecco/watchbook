/* ---------------------------------
Auth
--------------------------------- */

import React, { useReducer, useState } from "react";
import { log, storage, capitalize } from "../../utils";
import * as firebase from "firebase/app";
import { Redirect } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import TabSwitcher from "../../components/TabSwitcher/TabSwitcher";
import { useSelector, useDispatch } from "react-redux";
import { showNotif } from "../../redux/actions";
import { RootState } from "../../store";
import { AuthForm } from "../../components/AuthForm/AuthForm";

export default function Auth() {
  const dispatch = useDispatch();
  const { authenticated } = useSelector(
    (state: RootState) => state.authentication
  );

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
            timeOut: 4000,
          })
        );

        log("@Auth", error);
        break;
      }
    }
  }

  return !authenticated ? (
    // TODO
    // @ts-ignore
    <Layout rootClass="Auth" hasNav={false} hasFooter={false}>
      <PageHeader
        title="Auth"
        // icon="account_circle"
      />

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
