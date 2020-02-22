/* ---------------------------------
App
--------------------------------- */

import React, { useReducer, useEffect } from "react";
import { storage } from "./utils";
import * as firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
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
import Auth from "./pages/Auth/Auth";
import { initialAuthState } from "./initialAuthState";
import NotificationMessage from "./components/NotificationMessage/NotificationMessage";
import TestPage from "./pages/TestPage";
import { log } from "./utils";

// global utils
window.storage = storage;

// firebase initializers
firebase.initializeApp(firebaseConfig);
export const db = firebase.database();

// context initializers
export const StoreContext = React.createContext();
export const AuthContext = React.createContext();

// app
function App() {
  /**
   * auth reducer
   */

  const [authState, setAuthState] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialAuthState
  );

  /**
   * store reducer
   */

  const [store, dispatch] = useReducer(reducer, initialState);

  /**
   * Auth observer
   */

  useEffect(() => {
    const observer = firebase.auth().onAuthStateChanged(user => {
      /**
       * user should be present in case of
       *  signup, login or persistent session
       */

      // prettier-ignore
      if (user)
      {
        log("@@@ user is present");
        
        const {
          uid, name, email, photoUrl, emailVerified,
        } = user;
        
        // TODO use just the store context
        dispatch({type: 'INIT_USER', uid})

        setAuthState({
          authenticated: true,
          user: {
            uid, name, email, photoUrl, emailVerified,
          }
        })
      }
      
      else
      {
        log("@@@, no user is present", user);
      }
    });

    return () => observer(); // this will unsubscribe from the obs.
  }, []);

  return (
    <div className="App">
      <AuthContext.Provider value={[authState, setAuthState]}>
        <StoreContext.Provider value={[store, dispatch]}>
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

              {/* TestPage */}
              <Route exact path="/test">
                <TestPage />
              </Route>
            </Switch>
          </Router>
        </StoreContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
