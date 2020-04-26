/* ---------------------------------
AppFooter
--------------------------------- */

import React from "react";

export default function AppFooter() {
  return (
    <footer className="AppFooter">
      <span>
        {process.env.REACT_APP_APP_VERSION} {process.env.REACT_APP_APP_BUILD}
      </span>
    </footer>
  );
}
