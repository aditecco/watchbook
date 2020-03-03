/* ---------------------------------
ViewOptions
--------------------------------- */

import React from "react";
import MaterialIcon from "../../components/Misc/MaterialIcon";

export default function ViewOptions({ labels, toggleCallback, toggleStatus }) {
  return (
    <div className="viewOptions">
      <button className="viewToggle" type="button" onClick={toggleCallback}>
        {!toggleStatus ? (
          <>
            <MaterialIcon icon="view_stream" />
            <span className="viewToggleLabel">{labels.off}</span>
          </>
        ) : (
          <>
            <MaterialIcon icon="view_module" />
            <span className="viewToggleLabel">{labels.on}</span>
          </>
        )}
      </button>
    </div>
  );
}
