/* ---------------------------------
MaterialIcon
--------------------------------- */

import React, { CSSProperties, ReactElement } from "react";
import { addClasses } from "../../utils";

interface OwnProps {
  icon?: string;
  className?: string;
  style?: CSSProperties;
}

export default function MaterialIcon({
  icon,
  className,
  style,
}: OwnProps): ReactElement {
  return (
    <i className={"material-icons" + addClasses(className)} style={style ?? {}}>
      {icon}
    </i>
  );
}
