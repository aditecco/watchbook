"use client";

import React, { ReactElement, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface OwnProps {
  selected: number | undefined;
}

export default function Navbar({ selected }: OwnProps): ReactElement {
  const pathname = usePathname();
  const [selectedNavItem, setSelectedNavItem] = useState(selected);

  function handleNavItemClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const { currentTarget: _this } = e;
    setSelectedNavItem(Number(_this.id));
  }

  // Determine selected based on pathname
  const getSelectedFromPath = () => {
    if (pathname === "/home" || pathname === "/") return 1;
    if (pathname === "/watched") return 2;
    if (pathname === "/to-watch") return 3;
    return selected;
  };

  const currentSelected = getSelectedFromPath();

  return (
    <nav className="Navbar">
      <div className="wrapper">
        <ul className="linkList">
          <li className="linkContainer">
            <Link
              href="/home"
              onClick={handleNavItemClick}
              className={
                currentSelected === 1 || selectedNavItem === 1 ? "selected" : ""
              }
              id="1"
            >
              <i className="material-icons">home</i>{" "}
              <span className="navLabel">Home</span>
            </Link>
          </li>

          <li className="linkContainer">
            <Link
              href="/watched"
              onClick={handleNavItemClick}
              className={
                currentSelected === 2 || selectedNavItem === 2 ? "selected" : ""
              }
              id="2"
            >
              <i className="material-icons">check_circle</i>{" "}
              <span className="navLabel">Watched</span>
            </Link>
          </li>

          <li className="linkContainer">
            <Link
              href="/to-watch"
              onClick={handleNavItemClick}
              className={
                currentSelected === 3 || selectedNavItem === 3 ? "selected" : ""
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
