/* ---------------------------------
Settings
--------------------------------- */

import React, { useState, useContext, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { API_KEY } from "../../constants";
import { log, storage } from "../../utils";
import { AuthContext, StoreContext } from "../../App";
import { useApiKey } from "../../hooks";

export default function Settings() {
  const [input, setInput] = useState("");
  const [hasKey, setHasKey] = useState(false); //
  const [{ user }] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);
  // let key = useApiKey();
  const { apiKey } = store.userData[user.uid].settings;

  useEffect(() => {
    if (apiKey) setHasKey(true);
  }, [apiKey]);

  /**
   * handleSaveKey
   */

  function handleSaveKey() {
    if (!input) {
      window.alert("nope!");

      return;
    }

    setInput("");
    // setHasKey(true);

    dispatch({ type: "SET_API_KEY", key: input, uid: user.uid });
    storage.push(API_KEY, input);
  }

  return (
    <Layout rootClass="Settings">
      <PageHeader title="settings" icon="settings" />

      {hasKey ? (
        <div className="p">Your API key: {apiKey}</div>
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
