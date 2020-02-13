/* ---------------------------------
App
--------------------------------- */

import React, { useReducer } from "react";
import { storage } from "./utils";

import * as firebase from "firebase/app";
import "firebase/database";
import firebaseConfig from "./config/firebaseConfig";

import initialState from "./initialState";
import reducer from "./reducer";
import Watched from "./pages/Watched/Watched";
import ToWatch from "./pages/ToWatch/ToWatch";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import Start from "./pages/Start/Start";
import Home from "./pages/Home/Home";
import TestPage from "./pages/TestPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/index.scss";
import NotificationMessage from "./components/NotificationMessage/NotificationMessage";

firebase.initializeApp(firebaseConfig);
export const db = firebase.database();

export const Store = React.createContext(null);
window.storage = storage;

function App() {
  return (
    <div className="App">
      <Store.Provider value={useReducer(reducer, initialState)}>
        <Router>
          <Switch>
            <Route exact path="/">
              <Start />
            </Route>

            <Route exact path="/home">
              <Home />
            </Route>

            <Route exact path="/watched">
              <Watched />
            </Route>

            <Route exact path="/to-watch">
              <ToWatch />
            </Route>

            <Route exact path="/settings">
              <Settings />
            </Route>

            <Route exact path="/profile">
              <Profile />
            </Route>

            <Route exact path="/test">
              <TestPage />
            </Route>
          </Switch>
        </Router>
      </Store.Provider>
    </div>
  );
}

export default App;
