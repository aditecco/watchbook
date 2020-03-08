/* ---------------------------------
Layout
--------------------------------- */

import React from "react";
import Navbar from "../Navbar/Navbar";

export default function Layout({
  children,
  rootClass,
  selected = null,
  hasNav = true
}) {
  return (
    <div className={"Layout" + " " + rootClass}>
      <main className={rootClass + "Content"}>{children}</main>

      {hasNav && <Navbar selected={selected} />}
    </div>
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
