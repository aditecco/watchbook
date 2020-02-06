/* ---------------------------------
Settings
--------------------------------- */

import React from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { API_KEY } from "../../constants";
import { log, storage } from "../../utils";

export default function Settings() {
  const key = storage.pull(API_KEY);

  return (
    <Layout rootClass="Settings">
      <PageHeader title="settings" icon="settings" />

      <div className="p">Your API key: {key}</div>
    </Layout>
  );
}
