"use client";

import React, { useReducer } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";
import PageHeader from "@/components/PageHeader/PageHeader";
import TabSwitcher from "@/components/TabSwitcher/TabSwitcher";
import { useAppStore } from "@/store";
import { useAuth } from "@/hooks/use-auth";
import { AuthForm } from "@/components/AuthForm/AuthForm";

export default function Auth() {
  const router = useRouter();
  const { auth, showNotification } = useAppStore();
  const {
    signIn: authSignIn,
    signUp: authSignUp,
    authenticated,
    loading,
  } = useAuth();

  const initialComponentState = {
    hasError: { error: false, errorMeta: {} },
  };

  const [state, setState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialComponentState,
  );

  /**
   * handleAuth
   */

  async function handleAuth({
    action,
    email,
    password,
  }: {
    action: string;
    email: string;
    password: string;
  }) {
    if (!validate({ email, password })) {
      window.alert("nope!");
      return;
    }

    try {
      if (action === "login") {
        await authSignIn(email, password);
      } else if (action === "signup") {
        await authSignUp(email, password);
      }

      setState(initialComponentState);

      showNotification(`Welcome!`, "success");
    } catch (err) {
      handleError(err);
    }
  }

  /**
   * validate
   */

  function validate(input: { email: string; password: string }) {
    return Object.values(input).every((val) => val !== "");
  }

  /**
   * handleError
   */

  function handleError(error: any) {
    const { code, message } = error;

    setState({ hasError: { error: true, errorMeta: { code, message } } });

    switch (code) {
      case "400": {
        /**
         * EMAIL_NOT_FOUND
         * INVALID_PASSWORD
         */
        break;
      }

      default: {
        showNotification(`${code}: ${message}`, "error");

        console.error("@Auth", error);
        break;
      }
    }
  }

  // Show loading while checking auth state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout rootClass="Auth" hasNav={false} hasFooter={false}>
      <PageHeader
        title="Auth"
        // icon="account_circle"
      />

      <div className="wrapper thin">
        <TabSwitcher
          tabs={[
            {
              name: "Login",
              content: <AuthForm action="login" actionHandler={handleAuth} />,
            },
            {
              name: "Signup",
              content: <AuthForm action="signup" actionHandler={handleAuth} />,
            },
          ]}
        />
      </div>
    </Layout>
  );
}
