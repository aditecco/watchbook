/* ---------------------------------
MaterialIcon
--------------------------------- */

import React from "react";

export default function MaterialIcon({ icon, classes }) {
  const additionalClasses = classes
    ? " " + [...classes].toString().replace(/\,/g, " ")
    : "";

  return <i className={"material-icons" + additionalClasses}>{icon}</i>;
}
