/* ---------------------------------
BlankPage
--------------------------------- */

import React from "react";
import Layout from "../components/Layout/Layout";
import PageHeader from "../components/PageHeader/PageHeader";

export default function BlankPage({ title, icon, children }) {
  return (
    // TODO
    // @ts-ignore
    <Layout rootClass={title} hasNav={false}>
      <PageHeader title={title} icon={icon} />
      {children}
    </Layout>
  );
}
