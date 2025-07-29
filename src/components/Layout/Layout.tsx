/* ---------------------------------
Layout
--------------------------------- */

import React, { ReactElement, ReactFragment } from "react";
import Navbar from "../Navbar/Navbar";
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../AppFooter/AppFooter";

interface OwnProps {
  children: ReactElement | any; // TODO
  rootClass: string;
  selected?: number | undefined;
  hasNav?: boolean;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export default function Layout({
  children,
  rootClass,
  selected,
  hasNav = true,
  hasHeader = true,
  hasFooter = false,
}: OwnProps): ReactFragment {
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
