/* ---------------------------------
MaterialIcon
--------------------------------- */

import React from "react";
import { addClasses } from "../../utils";

export default function MaterialIcon({ icon, className }) {
  return <i className={"material-icons" + addClasses(className)}>{icon}</i>;
}
