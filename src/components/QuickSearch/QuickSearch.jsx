/* ---------------------------------
QuickSearch
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";

export default function QuickSearch({
  className,
  onChange,
  placeholder,
  value
}) {
  return (
    <div className="QuickSearch">
      <div className="searchFieldContainer">
        <MaterialIcon icon="search" className="searchIcon" />

        <input
          type="text"
          className={`searchField${className ? " " + className : ""}`}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}
