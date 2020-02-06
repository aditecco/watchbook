/* ---------------------------------
Profile
--------------------------------- */

import React from "react";
import Layout from "../components/Layout/Layout";
import PageHeader from "../components/PageHeader/PageHeader";
import { Global } from "../App";
import { log } from "../utils";

export default function TestPage() {
  return (
    <Layout rootClass="Test">
      <PageHeader title="Test" icon="build" />
    </Layout>
  );
}
