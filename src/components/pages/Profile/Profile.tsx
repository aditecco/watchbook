"use client";

import React, { useEffect, useReducer } from "react";
import Layout from "@/components/Layout/Layout";
import PageHeader from "@/components/PageHeader/PageHeader";
// import { useRouter } from "next/navigation";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";

export default function Profile() {
  const { auth } = useAppStore();
  const { signOut } = useAuth();
  // const router = useRouter();

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
    },
  );

  function toggleInput(e: React.MouseEvent<HTMLButtonElement>) {
    const { toggletarget } = e.currentTarget.dataset;

    if (toggletarget) {
      setFormFields({
        [toggletarget]: !formFields[toggletarget as keyof typeof formFields],
      });
    }
  }

  function handleSignout() {
    signOut().catch((err) => console.error("@Profile", err));
  }

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);
  }, []);

  // If not authenticated, redirect to auth
  if (!auth.authenticated) {
    // router.push('/auth');

    if (typeof window !== "undefined") {
      window.location.href = window.location.origin + "/auth";
    } else return null;
  }

  return (
    <Layout rootClass="Profile">
      <PageHeader
        title="Profile"
        // icon="account_circle"
      />

      <div className="wrapper thin">
        <p className="ProfileWelcome">Hello, {auth.user?.email}!</p>

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
                placeholder={auth.user?.email || "email@example.com"}
                className="BaseInput UserDataFormInputField"
                value={formFields.userEmailInput}
                onChange={(e) =>
                  setFormFields({ userEmailInput: e.currentTarget.value })
                }
              />

              <button
                data-toggletarget="isUserEmailEnabled"
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
                onChange={(e) =>
                  setFormFields({ userHandleInput: e.currentTarget.value })
                }
              />

              <button
                data-toggletarget="isUserHandleEnabled"
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
  );
}
