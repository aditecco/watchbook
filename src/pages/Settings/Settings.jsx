/* ---------------------------------
Settings
--------------------------------- */

import React, { useEffect, useState, useContext } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { API_KEY } from "../../constants";
import { log, storage } from "../../utils";
import { AuthContext, StoreContext } from "../../App";

export default function Settings() {
  const [input, setInput] = useState("");
  const [{ user }] = useContext(AuthContext);
  const [store, dispatch] = useContext(StoreContext);
  const key = useApiKey();

  /**
   * useApiKey
   */

  function useApiKey() {
    const [key, setKey] = useState("");
    const { apiKey } = store.userData[user.uid].settings;

    useEffect(() => {
      const key = storage.pull(API_KEY) || apiKey;

      key && setKey(key);
    }, []);

    return key;
  }

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
