/* ---------------------------------
Spinner
--------------------------------- */

import React from "react";

export default function Spinner({ inline, color, duration, shadow, styles }) {
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
