/* ---------------------------------
Profile
--------------------------------- */

import React from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import { log } from "../../utils";

export default function Profile() {
  return (
    <Layout rootClass="Profile">
      <PageHeader title="profile" icon="account_circle" />
    </Layout>
  );
}
