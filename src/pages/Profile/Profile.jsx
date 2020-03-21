/* ---------------------------------
Profile
--------------------------------- */

import React, { useState, useContext } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import * as firebase from "firebase/app";
import "firebase/auth";
import { log } from "../../utils";
import { AuthContext, StoreContext } from "../../App";
import { Redirect } from "react-router-dom";
import { initialAuthState } from "../../initialAuthState";
import MaterialIcon from "../../components/Misc/MaterialIcon";

export default function Profile() {
  const [{ authenticated, user }, setAuthState] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);
  const [isInputEnabled, setIsInputEnabled] = useState(false);

  // TODO should enable only the input we want to edit
  function toggleInput() {
    setIsInputEnabled(!isInputEnabled);
  }

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

        <form className="UserDataForm">
          <fieldset className="UserDataFormGroup">
            <label className="UserDataFormLabel" htmlFor="userEmail">
              Email
            </label>

            <div className="UserDataFormFieldContainer">
              <input
                disabled={!isInputEnabled}
                id="userEmail"
                name="userEmail"
                type="email"
                placeholder={user.email || "email@example.com"}
                className="BaseInput UserDataFormInputField"
              />

              <button
                type="button"
                className="UserDataFormEditButton"
                onClick={toggleInput}
              >
                <MaterialIcon icon="edit" />
              </button>
            </div>
          </fieldset>

          <fieldset className="UserDataFormGroup">
            <label className="UserDataFormLabel" htmlFor="userHandle">
              Screen name
            </label>

            <div className="UserDataFormFieldContainer">
              <input
                disabled={!isInputEnabled}
                id="userHandle"
                name="userHandle"
                type="text"
                className="BaseInput UserDataFormInputField"
              />

              <button
                type="button"
                className="UserDataFormEditButton"
                onClick={toggleInput}
              >
                <MaterialIcon icon="edit" />
              </button>
            </div>
          </fieldset>
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
