/* ---------------------------------
MaterialIcon
--------------------------------- */

import React, { ReactElement } from "react";
import { addClasses } from "../../utils";

interface OwnProps {
  icon?: string;
  className?: string;
}

export default function MaterialIcon({
  icon,
  className,
}: OwnProps): ReactElement {
  return <i className={"material-icons" + addClasses(className)}>{icon}</i>;
}
