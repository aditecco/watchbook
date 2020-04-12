/* ---------------------------------
Profile
--------------------------------- */

import React, { useReducer } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import * as firebase from "firebase/app";
import "firebase/auth";
import { log } from "../../utils";
import { Redirect } from "react-router-dom";
import MaterialIcon from "../../components/Misc/MaterialIcon";
import { destroyUser } from "../../actions";
import { useSelector, useDispatch } from "react-redux";

export default function Profile() {
  // const [{ authenticated, user }, setAuthState] = useContext(AuthContext);
  const { authenticated, user } = useSelector(state => state.authentication);
  const dispatch = useDispatch();
  const [formFields, setFormFields] = useReducer(
    (state, newState) => ({
      ...state,
      ...newState,
    }),
    {
      isUserEmailEnabled: false,
      userEmailInput: "",
      isUserHandleEnabled: false,
      userHandleInput: "",
    }
  );

  function toggleInput(e) {
    const { toggletarget } = e.currentTarget.dataset;

    setFormFields({ [toggletarget]: !formFields[toggletarget] });
  }

  function handleSignout() {
    firebase
      .auth()
      .signOut()
      .then(() => dispatch(destroyUser()))
      .catch(err => console.error("@Profile", err));
  }

  return authenticated ? (
    <Layout rootClass="Profile">
      <PageHeader title="profile" icon="account_circle" />

      <div className="wrapper">
        <p className="ProfileWelcome">Hello, {user.email}!</p>

        <form className="UserDataForm">
          <fieldset className="UserDataFormGroup">
            <label className="UserDataFormLabel" htmlFor="userEmail">
              Email
            </label>

            <div className="UserDataFormFieldContainer">
              <input
                disabled={!formFields.isUserEmailEnabled}
                id="userEmail"
                name="userEmail"
                type="email"
                placeholder={user.email || "email@example.com"}
                className="BaseInput UserDataFormInputField"
                value={formFields.userEmailInput}
                onChange={e =>
                  setFormFields({ userEmailInput: e.currentTarget.value })
                }
              />

              <button
                data-toggleTarget="isUserEmailEnabled"
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
                disabled={!formFields.isUserHandleEnabled}
                id="userHandle"
                name="userHandle"
                type="text"
                className="BaseInput UserDataFormInputField"
                value={formFields.userHandleInput}
                onChange={e =>
                  setFormFields({ userHandleInput: e.currentTarget.value })
                }
              />

              <button
                data-toggleTarget="isUserHandleEnabled"
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
