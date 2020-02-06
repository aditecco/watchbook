/* ---------------------------------
PageHeader
--------------------------------- */

import React from "react";
// import "./PageHeader.scss";

export default function PageHeader({ title, icon, subHeading }) {
  return (
    <header className="PageHeader">
      <div className="container">
        <i className="material-icons">{icon || null}</i>
        <h1 className="PageHeading">{title}</h1>
      </div>

      {subHeading && (
        <div className="container">
          <div className="dot"></div>
          <h4 className="PageSubHeading">{subHeading}</h4>
        </div>
      )}
    </header>
  );
}
