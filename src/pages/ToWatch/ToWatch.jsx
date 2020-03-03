/* ---------------------------------
ToWatch
--------------------------------- */

import React from "react";
import Layout from "../../components/Layout/Layout";
import PageHeader from "../../components/PageHeader/PageHeader";
import DataProvider from "../../components/DataProvider";

export default function ToWatch() {
  return (
    <Layout rootClass="ToWatch" selected={3}>
      <PageHeader
        title="to watch"
        icon="bookmark"
        subHeading={
          <>
            <span className="highlight">894 Movies, </span>
            <span className="highlight">239 TV Shows</span>
          </>
        }
      />

      <DataProvider
        filter={data => data.filter(d => d < 2)}
        render={data => (
          <div id="hey">
            {data.map(d => (
              // eslint-disable-next-line react/jsx-key
              <span>{d}</span>
            ))}
          </div>
        )}
      />
    </Layout>
  );
}
