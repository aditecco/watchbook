/* ----------------
  ErrorBoundary
---------------- */

import React, { Component } from "react";
import Layout from "../Layout/Layout";
import PageHeader from "../PageHeader/PageHeader";

export default class ErrorBoundary extends Component {
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
      <Layout rootClass="ErrorPage" hasNav={false}>
        <PageHeader title="Error" icon="error_outline" />
        <h3>An error has occurred.</h3>
      </Layout>
    ) : (
      this.props.children
    );
  }
}
