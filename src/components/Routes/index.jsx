/* ---------------------------------
Routes
--------------------------------- */

import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "../../pages/Auth/Auth";
import BlankPage from "../../pages/BlankPage";
import Home from "../../pages/Home/Home";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Profile from "../../pages/Profile/Profile";
import Settings from "../../pages/Settings/Settings";
import ContentPage from "../../pages/ContentPage/ContentPage";
import { PRIMARY_DATASET_KEY, SECONDARY_DATASET_KEY } from "../../constants";

export default function Routes() {
  return (
    // TODO refactor w/o PrivateRoute
    <Router>
      <Switch>
        <Route exact path="/">
          <Auth />
        </Route>

        <PrivateRoute exact path="/home">
          <Home />
        </PrivateRoute>

        <PrivateRoute exact path="/watched">
          <ContentPage
            dataSet={PRIMARY_DATASET_KEY}
            selectedIndex={2}
            title="Watched"
            //
          />
        </PrivateRoute>

        <PrivateRoute exact path="/to-watch">
          <ContentPage
            dataSet={SECONDARY_DATASET_KEY}
            selectedIndex={3}
            title="To Watch"
            //
          />
        </PrivateRoute>

        <PrivateRoute exact path="/settings">
          <Settings />
        </PrivateRoute>

        <PrivateRoute exact path="/profile">
          <Profile />
        </PrivateRoute>

        <Route
          render={({ location }) => (
            <BlankPage title="404" icon="wifi_off">
              <h4>Sorry, nothing to see at {location.pathname}</h4>
            </BlankPage>
          )}
        />
      </Switch>
    </Router>
  );
}
