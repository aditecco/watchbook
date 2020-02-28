/* ---------------------------------
PrivateRoute
--------------------------------- */

import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../App";

export default function PrivateRoute({ children, ...rest }) {
  const [{ authenticated }] = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        authenticated ? (
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
