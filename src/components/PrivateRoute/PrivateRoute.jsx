/* ---------------------------------
PrivateRoute
--------------------------------- */

import React from "react";
import { Route, Redirect, useHistory, useLocation } from "react-router-dom";

export default function PrivateRoute({ isAuthenticated, children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
