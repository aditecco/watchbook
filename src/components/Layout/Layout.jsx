/* ---------------------------------
Layout
--------------------------------- */

import React from "react";
import Navbar from "../Navbar/Navbar";
import AppHeader from "../AppHeader/AppHeader";
import AppFooter from "../AppFooter/AppFooter";

export default function Layout({
  children,
  rootClass,
  selected = null,
  hasNav = true,
  hasHeader = true,
  hasFooter = false,
}) {
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

// export default function Layout({ children, rootClass }) {
//   return (
//     <Context.Consumer>
//       {([store, dispatch]) => (
//         <main className={rootClass} store={store} dispatch={dispatch}>
//           {children}
//         </main>
//       )}
//     </Context.Consumer>
//   );
// }
