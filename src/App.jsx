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
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

// firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.database();

// store context
export const Store = React.createContext(null);
export const Auth = React.createContext(null);

// global utils
window.storage = storage;

export const initialAuthState = {
  user: null,
  authenticated: false
};

function App() {
  return (
    <div className="App">
      <Auth.Provider
        value={useReducer(
          (state, newState) => ({ ...state, ...newState }),
          initialAuthState
        )}
      >
        <Store.Provider value={useReducer(reducer, initialState)}>
          <Auth.Consumer>
            {([authState, getOrSetAuthState]) => (
              <Router>
                <Switch>
                  <Route exact path="/">
                    <Start />
                  </Route>

                  <PrivateRoute
                    exact
                    path="/home"
                    isAuthenticated={authState.authenticated}
                  >
                    <Home />
                  </PrivateRoute>

                  <PrivateRoute
                    exact
                    path="/watched"
                    isAuthenticated={authState.authenticated}
                  >
                    <Watched />
                  </PrivateRoute>

                  <PrivateRoute
                    exact
                    path="/to-watch"
                    isAuthenticated={authState.authenticated}
                  >
                    <ToWatch />
                  </PrivateRoute>

                  <PrivateRoute
                    exact
                    path="/settings"
                    isAuthenticated={authState.authenticated}
                  >
                    <Settings />
                  </PrivateRoute>

                  <PrivateRoute
                    exact
                    path="/profile"
                    isAuthenticated={authState.authenticated}
                  >
                    <Profile />
                  </PrivateRoute>

                  {/* <Route exact path="/test">
                      <TestPage />
                    </Route> */}
                </Switch>
              </Router>
            )}
          </Auth.Consumer>
        </Store.Provider>
      </Auth.Provider>
    </div>
  );
}

export default App;
