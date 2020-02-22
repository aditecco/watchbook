/* ---------------------------------
Profile
--------------------------------- */

import React, { useContext } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import * as firebase from "firebase/app";
import "firebase/auth";
import { log } from "../../utils";
import { AuthContext } from "../../App";
import { Redirect } from "react-router-dom";
import { initialAuthState } from "../../initialAuthState";

export default function Profile() {
  const [{ authenticated, user }, setAuthState] = useContext(AuthContext);

  function handleSignout() {
    firebase
      .auth()
      .signOut()
      .then(() => log("signed out!"))
      .then(() => setAuthState(initialAuthState))
      .catch(err => console.error("@Profile", err));
  }

  return authenticated ? (
    <Layout rootClass="Profile">
      <PageHeader title="profile" icon="account_circle" />

      <span>Hello, {user.email}</span>

      <button type="button" className="logoutButton" onClick={handleSignout}>
        Logout
      </button>
    </Layout>
  ) : (
    <Redirect to="/" />
  );
}
