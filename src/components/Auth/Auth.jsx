/* ---------------------------------
Auth
--------------------------------- */

import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import Start from "../../pages/Start/Start";
import { AuthContext } from "../../App";

export default function Auth() {
  const [{ authenticated }] = useContext(AuthContext);

  useEffect(() => {
    console.log("@Auth, authenticated: ", authenticated);
    return () => console.log("@Auth", authenticated);
  }, [authenticated]);

  return !authenticated ? <Start /> : <Redirect to="/home" />;
}
