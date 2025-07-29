"use client";

import React, { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useAppStore } from "@/store";

export default function Settings() {
  const { auth } = useAppStore();

  useEffect(() => {
    // reset scroll position when we enter the page
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout rootClass="Settings">
      <PageHeader
        title="Settings"
        // icon="settings"
      />

      <div className="wrapper thin">
        <div className="SettingsSection">
          <h3>API Configuration</h3>
          <p className="SettingsInfo">
            The OMDB API key is now configured server-side for security. No user
            configuration is required.
          </p>
        </div>

        <footer className="SettingsFooter">
          <small>
            WatchBook 2025 &middot;{" "}
            <a href="https://github.com/your-repo">source</a>
          </small>
        </footer>
      </div>
    </Layout>
  );
}
