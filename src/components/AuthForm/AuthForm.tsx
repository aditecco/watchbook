/* ---------------------------------
AuthForm
--------------------------------- */

import React, { useState } from "react";
import { InputValidator } from "../../lib/validation";

// Simple capitalize function to avoid SSR issues
const capitalize = (word: string) => {
  if (!word) return "";
  return word.charAt(0).toUpperCase() + word.slice(1);
};

interface AuthFormProps {
  action: string;
  actionHandler: (params: {
    action: string;
    email: string;
    password: string;
  }) => void;
}

export const AuthForm = ({ action, actionHandler }: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setEmail(value);

    // Clear error when user starts typing
    if (emailError) setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);

    // Clear error when user starts typing
    if (passwordError) setPasswordError("");
  };

  const handleSubmit = () => {
    // Validate email
    const emailValidation = InputValidator.validateEmail(email);
    if (!emailValidation.isValid) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate password
    // const passwordValidation = InputValidator.validatePassword(password);
    // if (!passwordValidation.isValid) {
    //   setPasswordError("Password must be at least 8 characters with uppercase, lowercase, and numbers");
    //   return;
    // }

    // Clear any existing errors
    setEmailError("");
    setPasswordError("");

    // Submit with sanitized values
    actionHandler({
      action,
      email: emailValidation.sanitized,
      // password: passwordValidation.sanitized
      password,
    });
  };

  return (
    <form className="authForm" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="emailField">{`${capitalize(action)} email`}</label>
      <input
        id="emailField"
        name="emailField"
        type="email"
        className={`BaseInput ${emailError ? "error" : ""}`}
        placeholder={`${action}.email@example.com`}
        value={email}
        onChange={handleEmailChange}
        autoComplete="email"
      />
      {emailError && <span className="error-message">{emailError}</span>}

      <label htmlFor="passwordField">Password</label>
      <input
        id="passwordField"
        name="passwordField"
        type="password"
        className={`BaseInput ${passwordError ? "error" : ""}`}
        placeholder="Enter your password"
        value={password}
        onChange={handlePasswordChange}
        autoComplete="current-password"
      />
      {passwordError && <span className="error-message">{passwordError}</span>}

      <button type="button" className="BaseButton" onClick={handleSubmit}>
        {capitalize(action)}
      </button>
    </form>
  );
};
