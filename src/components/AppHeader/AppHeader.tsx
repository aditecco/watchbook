/* ---------------------------------
AppHeader
--------------------------------- */

import React, { useContext } from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

export default function AppHeader() {
  const { authenticated } = useSelector(
    (state: RootState) => state.authentication
  );

  return (
    <header className="AppHeader">
      <div className="container wrapper">
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
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
