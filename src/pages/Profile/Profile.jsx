/* ---------------------------------
Profile
--------------------------------- */

import React from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import * as firebase from "firebase/app";
import "firebase/auth";
import { log } from "../../utils";

export default function Profile() {
  function handleSignout() {
    firebase
      .auth()
      .signOut()
      .then(() => log("signed out!"))
      .catch(err => console.error("@Profile", err));
  }

  return (
    <Layout rootClass="Profile">
      <PageHeader title="profile" icon="account_circle" />

      <button type="button" className="logoutButton" onClick={handleSignout}>
        Logout
      </button>
    </Layout>
  );
}
