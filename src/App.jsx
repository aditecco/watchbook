/* ---------------------------------
App
--------------------------------- */

import React, { useEffect, useState, useReducer } from "react";
import { LOCAL_STORAGE_KEY } from "./constants";
import { log, storage } from "./utils";
import store from "./store";
import reducer from "./reducer";
import Watched from "./pages/Watched/Watched";
import ToWatch from "./pages/ToWatch/ToWatch";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import Start from "./pages/Start/Start";
import Home from "./pages/Home/Home";
import TestPage from "./pages/TestPage";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/index.scss";

export const Global = React.createContext(null);
window.storage = storage;

function App() {
  return (
    <div className="App">
      <Global.Provider value={useReducer(reducer, store)}>
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
      </Global.Provider>
    </div>
  );
}

export default App;
