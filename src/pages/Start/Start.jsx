/* ---------------------------------
Start
--------------------------------- */

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { log, storage } from "../../utils";
import { API_KEY } from "../../constants";
import Modal from "../../components/Modal/Modal";

import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "../../config/firebaseConfig";

export default function Start() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [keyIsPresent, setKeyIsPresent] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // checkApiKey()
  }, []);

  function userSignup({ email, password }) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
      });
  }

  function userLogin(params) {}

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
      <Modal open={showModal} closeAction={() => setShowModal(false)}>
        <h3>Signup!</h3>

        <form action="" className="signupForm">
          <input type="text" className="signupEmail" placeholder="email" />
          <input
            type="password"
            className="signupPassword"
            placeholder="password"
          />

          <button
            type="button"
            className="signupButton"
            onClick={e => null}
            style={{ color: "white" }} // remove
          >
            Signup
          </button>
        </form>
      </Modal>

      <div className="Start">
        <h3>Signup or login</h3>
        <button
          type="button"
          className="signupButton"
          onClick={() => setShowModal(true)}
        >
          Signup
        </button>
        <button type="button" className="signupButton">
          Login
        </button>

        {isAuthorized && keyIsPresent && <Link to="/home">Home</Link>}
      </div>
    </>
  );
}
