/* ---------------------------------
TestPage
--------------------------------- */

import React, { useContext } from "react";
import Layout from "../components/Layout/Layout";
import PageHeader from "../components/PageHeader/PageHeader";
import { AuthContext, db } from "../App";
import { log } from "../utils";
import * as firebase from "firebase/app";
import "firebase/auth";

export default function TestPage() {
  const [{ user }] = useContext(AuthContext);
  const { uid } = user;
  // const dbContentRef = db.ref("content");
  // const dbUserRef = db.ref(`users/${uid}/watched`);
  // dbUserRef.on("value", val => log(val.val()));
  // dbContentRef.on("value", val => log(val.val()));

  function handleClick() {
    fetchData()
      .then(d => {
        log(d);
        return d;
      })
      .then(data => {
        const { watched, content } = data;

        const d = Object.keys(watched).map(key => content[key]);

        log(d);
      });
  }

  async function fetchData() {
    const watched = await db.ref(`users/${uid}/watched`).once("value");
    const movies = await db.ref("content").once("value");

    return {
      watched: await watched.val(),
      movies: await movies.val()
    };
  }

  return (
    <Layout rootClass="Test">
      <PageHeader title="Test" icon="build" />

      <button type="button" onClick={handleClick}>
        fetch data
      </button>
    </Layout>
  );
}
