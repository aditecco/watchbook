/* ----------------
  ErrorBoundary
---------------- */

import React, { Component } from "react";
import Layout from "../Layout/Layout";
import PageHeader from "../PageHeader/PageHeader";

interface ComponentState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component {
  state: ComponentState;

  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    return this.state.hasError ? (
      // TODO
      // @ts-ignore
      <Layout rootClass="ErrorPage" hasNav={false}>
        <PageHeader title="An error has occurred." icon="error_outline" />
      </Layout>
    ) : (
      this.props.children
    );
  }
}
