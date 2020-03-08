/* ---------------------------------
AppHeader
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { Link } from "react-router-dom";
import { NONAME } from "dns";

export default function AppHeader() {
  return (
    <header className="AppHeader">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        <h1 className="appTitle">
          Watch<span>Book</span>
        </h1>
      </Link>

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
    </header>
  );
}
