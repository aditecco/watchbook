/* ---------------------------------
Settings
--------------------------------- */

import React, { useState, useContext } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { API_KEY } from "../../constants";
import { log, storage } from "../../utils";
import { AuthContext, StoreContext } from "../../App";
import useApiKey from "../../hooks/useApiKey";

export default function Settings() {
  const [input, setInput] = useState("");
  const [{ user }] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);
  const key = useApiKey();

  /**
   * handleSaveKey
   */

  function handleSaveKey() {
    if (!input) {
      log("nope!");

      return;
    }

    dispatch({ type: "SET_API_KEY", key: input, uid: user.uid });

    storage.push(API_KEY, input);
  }

  return (
    <Layout rootClass="Settings">
      <PageHeader title="settings" icon="settings" />

      {key ? (
        <div className="p">Your API key: {key}</div>
      ) : (
        <form action="">
          <h4>Save your API Key</h4>
          <input
            type="text"
            placeholder="API key"
            onChange={e => setInput(e.currentTarget.value)}
            value={input}
          />
          <button type="button" onClick={handleSaveKey}>
            Save
          </button>
        </form>
      )}
    </Layout>
  );
}
