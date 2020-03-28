/* ---------------------------------
TestPage
--------------------------------- */

import React, { useContext } from "react";
import Layout from "../components/Layout/Layout";
import PageHeader from "../components/PageHeader/PageHeader";
import { AuthContext, StoreContext, db } from "../App";
import { log } from "../utils";
import * as firebase from "firebase/app";
import "firebase/auth";

export default function TestPage() {
  log(useContext(AuthContext));
  const [{ user }] = useContext(AuthContext);
  // const { uid } = user;
  const dbContentRef = db.ref("content");
  // const dbUserRef = db.ref(`users/${uid}`);
  // dbUserRef.on("value", val => log(val, val.val()));

  return (
    <Layout rootClass="Test">
      <PageHeader title="Test" icon="build" />
    </Layout>
  );
}
