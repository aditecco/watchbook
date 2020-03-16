/* ---------------------------------
Profile
--------------------------------- */

import React, { useContext } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import * as firebase from "firebase/app";
import "firebase/auth";
import { log } from "../../utils";
import { AuthContext, StoreContext } from "../../App";
import { Redirect } from "react-router-dom";
import { initialAuthState } from "../../initialAuthState";

export default function Profile() {
  const [{ authenticated, user }, setAuthState] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);

  function handleSignout() {
    firebase
      .auth()
      .signOut()
      .then(() => setAuthState(initialAuthState))
      .then(() => dispatch({ type: "DESTROY_USER" }))
      .catch(err => console.error("@Profile", err));
  }

  return authenticated ? (
    <Layout rootClass="Profile">
      <PageHeader title="profile" icon="account_circle" />

      <div className="wrapper">
        <p className="ProfileWelcome">Hello, {user.email}</p>

        <form>
          <label htmlFor="userEmail">Email</label>
          {/* TODO controlled inputs */}
          <input
            id="userEmail"
            name="userEmail"
            type="email"
            placeholder={user.email || "email@example.com"}
            className="BaseInput"
          />

          <label htmlFor="userHandle">Screen name</label>
          <input
            id="userHandle"
            name="userHandle"
            type="text"
            className="BaseInput"
          />
        </form>

        <button type="button" className="BaseButton" onClick={handleSignout}>
          Logout
        </button>
      </div>
    </Layout>
  ) : (
    <Redirect to="/" />
  );
}
