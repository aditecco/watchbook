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
import Home from "./pages/Home/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles/index.scss";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Auth from "./components/Auth/Auth";
import { initialAuthState } from "./initialAuthState";
import NotificationMessage from "./components/NotificationMessage/NotificationMessage";

// global utils
window.storage = storage;

// firebase
firebase.initializeApp(firebaseConfig);
export const db = firebase.database();

// context
export const StoreContext = React.createContext();
export const AuthContext = React.createContext();

function App() {
  return (
    <div className="App">
      <AuthContext.Provider
        value={useReducer(
          (state, newState) => ({ ...state, ...newState }),
          initialAuthState
        )}
      >
        <StoreContext.Provider value={useReducer(reducer, initialState)}>
          <NotificationMessage />

          <Router>
            <Switch>
              <Route exact path="/">
                <Auth />
              </Route>

              <PrivateRoute exact path="/home">
                <Home />
              </PrivateRoute>

              <PrivateRoute exact path="/watched">
                <Watched />
              </PrivateRoute>

              <PrivateRoute exact path="/to-watch">
                <ToWatch />
              </PrivateRoute>

              <PrivateRoute exact path="/settings">
                <Settings />
              </PrivateRoute>

              <PrivateRoute exact path="/profile">
                <Profile />
              </PrivateRoute>

              {/* <Route exact path="/test">
                      <TestPage />
                    </Route> */}
            </Switch>
          </Router>
        </StoreContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
