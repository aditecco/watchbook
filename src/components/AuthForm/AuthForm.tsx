/* ---------------------------------
AuthForm
--------------------------------- */

import React, { useState } from "react";
import { capitalize } from "../../utils";

export const AuthForm = ({ action, actionHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="authForm">
      <label htmlFor="emailField">{`${capitalize(action)} email`}</label>
      <input
        id="emailField"
        name="emailField"
        type="text"
        className="BaseInput"
        placeholder={`${action}.email@example.com`}
        value={email}
        onChange={e => setEmail(e.currentTarget.value)}
      />

      <label htmlFor="passwordField">Password</label>
      <input
        id="passwordField"
        name="passwordField"
        type="password"
        className="BaseInput"
        placeholder="xyz"
        value={password}
        onChange={e => setPassword(e.currentTarget.value)}
      />

      <button
        type="button"
        className="BaseButton"
        onClick={() => actionHandler({ action, email, password })}
      >
        {capitalize(action)}
      </button>
    </form>
  );
};
