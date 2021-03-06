/* ---------------------------------
AppFooter
--------------------------------- */

import React, { ReactElement } from "react";

export default function AppFooter(): ReactElement {
  return (
    <footer className="AppFooter">
      <span>
        {process.env.REACT_APP_APP_VERSION}{" "}
        {/* BUILD_ID is resolved by Netlify */}
        {process.env.BUILD_ID && process.env.BUILD_ID.substring(0, 4)}
      </span>
    </footer>
  );
}
