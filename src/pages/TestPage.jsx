/* ---------------------------------
TestPage
--------------------------------- */

import React, { useRef } from "react";
import Layout from "../components/Layout/Layout";
import PageHeader from "../components/PageHeader/PageHeader";
import { AuthContext, StoreContext } from "../App";
import { log } from "../utils";
import * as firebase from "firebase/app";
import "firebase/auth";

export default function TestPage() {
  const user = useRef(null);
  const password = useRef(null);

  /**
   * handleLogin
   */

  function handleLogin(e) {
    e.preventDefault();

    const { value: email } = user.current;
    const { value: password } = password.current;
    log(email, password);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const { email, uid } = user;

        log("new login");

        // showNotif("Welcome", 2000);
      })
      .catch(handleError);
  }

  /**
   * handleSignout
   */

  function handleSignout(e) {
    e.preventDefault();

    firebase
      .auth()
      .signOut()
      .then(() => log("signed out!"))
      .catch(handleError);
  }

  /**
   * handleError
   */

  function handleError(error) {
    const { code, message } = error;
    log("ERROR! ", code, message);

    switch (code) {
      case "400":
        // …
        break;

      default:
        break;
    }
  }

  return (
    <Layout rootClass="Test">
      <PageHeader title="Test" icon="build" />

      <form onSubmit={e => e.preventDefault()} action="">
        <input ref={user} type="text" placeholder="user" />
        <input ref={password} type="password" placeholder="password" />

        <button type="button" onClick={handleLogin}>
          Login
        </button>

        <button type="button" onClick={handleSignout}>
          Sign Out
        </button>
      </form>
    </Layout>
  );
}
