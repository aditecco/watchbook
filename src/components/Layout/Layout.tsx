/* ---------------------------------
Layout
--------------------------------- */

import React, { ReactChildren, ReactNode } from "react";
import Navbar from "../Navbar/Navbar";
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../AppFooter/AppFooter";

interface OwnProps {
  children: ReactChildren;
  rootClass: string;
  selected?: number | null;
  hasNav?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export default function Layout({
  children,
  rootClass,
  selected = null,
  hasNav = true,
  hasHeader = true,
  hasFooter = false,
}: OwnProps): ReactNode {
  return (
    <>
      {hasHeader && <AppHeader />}

      <div className={"Layout" + " " + rootClass}>
        <main className={rootClass + "Content"}>{children}</main>

        {/*
          comes _before_ the nav so that we
          can  create 'conditional styles' with
          the adjacent selector
        */}
        {hasFooter && <AppFooter />}

        {hasNav && <Navbar selected={selected} />}
      </div>
    </>
  );
}
