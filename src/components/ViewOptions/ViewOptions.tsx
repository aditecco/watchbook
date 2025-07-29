/* ---------------------------------
ViewOptions
--------------------------------- */

import React from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

export default function ViewOptions({
  labels,
  icons,
  toggleCallback,
  toggleStatus,
}) {
  return (
    <div className="viewOptions">
      <button className="viewToggle" type="button" onClick={toggleCallback}>
        {!toggleStatus ? (
          <>
            {/*
              if the icon is missing,
              it will use the one from
              the other case
            */}
            <MaterialIcon icon={icons.off || icons.on} />
            <span className="viewToggleLabel">{labels.off}</span>
          </>
        ) : (
          <>
            <MaterialIcon icon={icons.on || icons.off} />
            <span className="viewToggleLabel">{labels.on}</span>
          </>
        )}
      </button>
    </div>
  );
}
