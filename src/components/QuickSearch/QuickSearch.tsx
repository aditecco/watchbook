/* ---------------------------------
QuickSearch
--------------------------------- */

import React from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import { addClasses } from "../../utils";

export default function QuickSearch({
  className,
  filterHandler,
  inputValue: value,
  resetHandler,
  placeholder,
}) {
  return (
    <div className={"QuickSearch" + addClasses(className)}>
      <div className="wrapper">
        <div className="searchFieldContainer">
          <MaterialIcon icon="search" className="searchIcon" />

          {value && (
            <button className="resetButton" onClick={resetHandler}>
              <MaterialIcon icon="close" className="resetIcon" />
            </button>
          )}

          <input
            type="text"
            className="searchField"
            onChange={filterHandler}
            placeholder={placeholder}
            value={value}
            style={value ? { paddingRight: 38 } : {}}
          />
        </div>
      </div>
    </div>
  );
}
