/* ---------------------------------
Navbar
--------------------------------- */

import React, { ReactNode, ReactElement } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface OwnProps {
  selected: number | undefined;
}

export default function Navbar({ selected }: OwnProps): ReactElement {
  const [selectedNavItem, setSelectedNavItem] = useState(selected);

  function handleNavItemClick(e) {
    const { currentTarget: _this } = e;

    setSelectedNavItem(Number(_this.id));
  }

  return (
    <nav className="Navbar">
      <div className="wrapper">
        <ul className="linkList">
          <li className="linkContainer">
            <Link
              to="/home"
              onClick={handleNavItemClick}
              className={
                selected === 1 || selectedNavItem === 1 ? "selected" : null
              }
              id="1"
            >
              <i className="material-icons">home</i>{" "}
              <span className="navLabel">Home</span>
            </Link>
          </li>

          <li className="linkContainer">
            <Link
              to="/watched"
              onClick={handleNavItemClick}
              className={
                selected === 2 || selectedNavItem === 2 ? "selected" : null
              }
              id="2"
            >
              <i className="material-icons">check_circle</i>{" "}
              <span className="navLabel">Watched</span>
            </Link>
          </li>

          <li className="linkContainer">
            <Link
              to="/to-watch"
              onClick={handleNavItemClick}
              className={
                selected === 3 || selectedNavItem === 3 ? "selected" : null
              }
              id="3"
            >
              <i className="material-icons">bookmark</i>{" "}
              <span className="navLabel">To Watch</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
