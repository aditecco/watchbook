/* ---------------------------------
Settings
--------------------------------- */

import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { API_KEY } from "../../constants";
import { log, storage } from "../../utils";

export default function Settings() {
  const [key, setKey] = useState("");

  useEffect(() => {
    const key = storage.pull(API_KEY);

    key && setKey(key);
  }, []);

  function handleSaveKey() {}

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
            onChange={e => setKey(e.currentTarget.value)}
          />
          <button type="button" onClick={handleSaveKey}>
            Save
          </button>
        </form>
      )}
    </Layout>
  );
}
