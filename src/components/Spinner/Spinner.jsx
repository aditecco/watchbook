/* ---------------------------------
Spinner
--------------------------------- */

import React from "react";

export default function Spinner({ color, duration, shadow }) {
  return (
    <div className="SpinnerContainer">
      <div
        className="Spinner"
        style={
          [color, duration, shadow].some(prop => prop !== undefined)
            ? {
                borderTopColor: color,
                animationDuration: duration,
                boxShadow: shadow
              }
            : {}
        }
      />
    </div>
  );
}
