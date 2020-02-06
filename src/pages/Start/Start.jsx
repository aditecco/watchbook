/* ---------------------------------
Start
--------------------------------- */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { log, storage } from "../../utils";
import { API_KEY } from "../../constants";
import Modal from "../../components/Modal/Modal";

export default function Start() {
  const [keyIsPresent, setKeyIsPresent] = useState(false);

  useEffect(() => checkApiKey(), []);

  /**
   * Checks for the required API key
   */

  function checkApiKey() {
    const storageID = API_KEY;
    const key = storage.pull(storageID);

    if (!key) {
      const requestKey = window.prompt("Please enter your API key.");

      if (!requestKey) {
        window.alert("No valid key was provided.");
        return;
      }

      storage.push(storageID, requestKey);
    }

    setKeyIsPresent(true);
  }

  return (
    <>
      <Modal />
      <div className="Start">
        <div>Signup or login, Insert API key (WIP)</div>

        {keyIsPresent && <Link to="/home">Home</Link>}
      </div>
    </>
  );
}
