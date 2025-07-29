"use client";

import React from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import Link from "next/link";
import { useAppStore } from "@/store";

export default function AppHeader() {
  const { auth } = useAppStore();

  return (
    <header className="AppHeader">
      <div className="container wrapper">
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className="appTitle">
            Watch<span>Book</span>
          </h1>
        </Link>

        {auth.authenticated && (
          <nav className="appMenu">
            <ul className="appMenuContainer">
              <li>
                <Link href="/profile">
                  <MaterialIcon icon="account_circle" />
                </Link>
              </li>

              <li>
                <Link href="/settings">
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
