/* ---------------------------------
QuickSearch
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { addClasses } from "../../utils";

export default function QuickSearch({
  className,
  onChange,
  placeholder,
  value
}) {
  return (
    <div className={"QuickSearch" + addClasses(className)}>
      <div className="searchFieldContainer">
        <MaterialIcon icon="search" className="searchIcon" />

        <input
          type="text"
          className="searchField"
          onChange={onChange}
          placeholder={placeholder}
          value={value}
        />
      </div>
    </div>
  );
}
