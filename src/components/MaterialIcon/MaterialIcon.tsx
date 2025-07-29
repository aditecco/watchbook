/* ---------------------------------
MaterialIcon
--------------------------------- */

import React, { CSSProperties, ReactElement } from "react";

// Simple utility function to avoid SSR issues
const addClasses = (classes: string | undefined) => {
  return classes ? " " + classes : "";
};

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
