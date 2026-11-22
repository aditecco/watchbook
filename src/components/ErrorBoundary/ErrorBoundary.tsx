/* ----------------
  ErrorBoundary
---------------- */

import React, { Component, ErrorInfo, ReactNode } from "react";
import Layout from "../Layout/Layout";
import PageHeader from "../PageHeader/PageHeader";

interface ComponentProps {
  children: ReactNode;
}

interface ComponentState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ComponentProps,
  ComponentState
> {
  constructor(props: ComponentProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ComponentState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    return this.state.hasError ? (
      <Layout rootClass="ErrorPage" hasNav={false}>
        <PageHeader title="An error has occurred." icon="error_outline" />
      </Layout>
    ) : (
      this.props.children
    );
  }
}
