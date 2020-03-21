/* ---------------------------------
Profile
--------------------------------- */

import React, { useState, useContext, useReducer } from "react";
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
  const [isInputEnabled, setIsInputEnabled] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState
    }),
    {
      userEmail: false,
      userHandle: false
    }
  );

  function toggleInput(e) {
    const { binding } = e.currentTarget.dataset;

    setIsInputEnabled({ [binding]: !isInputEnabled[binding] });
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
                disabled={!isInputEnabled["userEmail"]}
                id="userEmail"
                name="userEmail"
                type="email"
                placeholder={user.email || "email@example.com"}
                className="BaseInput UserDataFormInputField"
              />

              <button
                data-binding="userEmail"
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
                disabled={!isInputEnabled["userHandle"]}
                id="userHandle"
                name="userHandle"
                type="text"
                className="BaseInput UserDataFormInputField"
              />

              <button
                data-binding="userHandle"
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
