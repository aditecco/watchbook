/* ---------------------------------
BlankPage
--------------------------------- */

import React, { ReactNode } from "react";
import Layout from "../Layout/Layout";
import PageHeader from "../PageHeader/PageHeader";

type BlankPageProps = {
  title: string;
  icon?: string;
  children?: ReactNode;
};

export default function BlankPage({ title, icon, children }: BlankPageProps) {
  return (
    <Layout rootClass={title} hasNav={false}>
      <PageHeader title={title} icon={icon} />
      {children}
    </Layout>
  );
}
