/* ---------------------------------
AppHeader
--------------------------------- */

import React, { useContext } from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";

export default function AppHeader() {
  const [{ authenticated }] = useContext(AuthContext);

  return (
    <header className="AppHeader">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1 className="appTitle">
          Watch<span>Book</span>
        </h1>
      </Link>

      {authenticated && (
        <nav className="appMenu">
          <ul className="appMenuContainer">
            <li>
              <Link to="/profile">
                <MaterialIcon icon="account_circle" />
              </Link>
            </li>

            <li>
              <Link to="/settings">
                <MaterialIcon icon="settings" />
              </Link>
            </li>

            {/* <li>
            <Link to="/test">
              <MaterialIcon icon="build" />
            </Link>
          </li> */}
          </ul>
        </nav>
      )}
    </header>
  );
}
