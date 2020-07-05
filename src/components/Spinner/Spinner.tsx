/* ---------------------------------
Spinner
--------------------------------- */

import React, { ReactNode, ReactElement } from "react";

interface OwnProps {
  inline?: boolean;
  color?: string;
  duration?: string;
  shadow?: string;
  styles?: React.CSSProperties;
}

// Spinner
export default function Spinner({
  inline,
  color,
  duration,
  shadow,
  styles,
}: OwnProps): ReactElement {
  return (
    <div
      className="SpinnerContainer"
      style={
        inline ? { position: "static", width: "100%", height: "100%" } : {}
      }
    >
      <div
        className="Spinner"
        style={
          [color, duration, shadow, styles].some(prop => prop !== undefined)
            ? {
                borderTopColor: color,
                animationDuration: duration,
                boxShadow: shadow,
                ...styles,
              }
            : {}
        }
      />
    </div>
  );
}
