/* ---------------------------------
AppFooter
--------------------------------- */

import React from "react";

export default function AppFooter() {
  return (
    <footer className="AppFooter">
      <span>
        {/* BUILD_ID is resolved by Netlify */}
        {process.env.REACT_APP_APP_VERSION}{" "}
        {process.env.BUILD_ID && process.env.BUILD_ID.substring(0, 4)}
      </span>
    </footer>
  );
}
