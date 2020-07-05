/* ---------------------------------
PrivateRoute
--------------------------------- */

import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function PrivateRoute({ children, ...rest }) {
  const { authenticated } = useSelector(
    (state: RootState) => state.authentication
  );

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
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
