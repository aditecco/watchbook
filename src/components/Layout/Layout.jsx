/* ---------------------------------
Layout
--------------------------------- */

import React from "react";
import Navbar from "../Navbar/Navbar";

export default function Layout({ children, rootClass, selected = null }) {
  return (
    <main className={rootClass}>
      {children}

      <Navbar selected={selected} />
    </main>
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
