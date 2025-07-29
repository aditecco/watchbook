/* ---------------------------------
FilterAndSort
--------------------------------- */

import React from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

// TODO rename 'sortHandler' and the like
export default function FilterAndSort({
  sortHandler,
  resetHandler,
  sortOptions: options,
  toggleCallback,
  activeFilters = {},
}) {
  return (
    <div className="FilterAndSort">
      <button className="closeButton" onClick={toggleCallback}>
        <MaterialIcon icon="close" />
      </button>

      <div className="FilterAndSortContainer">
        <div className="wrapper">
          <h3 className="FilterAndSortHeading">Filters</h3>

          <form className="FilterAndSortForm">
            {Object.entries(options).map(([sortKey, optionsArray], i) => (
              <div className="formGroup" key={`formGroup-${i}`}>
                <label htmlFor={sortKey}>
                  {sortKey}
                  {activeFilters[sortKey] && (
                    <span style={{ color: "#1ABC9C", marginLeft: "4px" }}>
                      ●
                    </span>
                  )}
                </label>

                <select
                  onChange={(e) => sortHandler(e.target.id, e.target.value)}
                  name={`select__${sortKey}`}
                  id={sortKey}
                  className="watchedSort"
                  value={activeFilters[sortKey] || ""}
                >
                  {/* TODO */}
                  {(optionsArray as any[]).map(([value, label], i) => (
                    <option
                      value={i === 0 ? "" : value}
                      key={"option-" + i}
                      //
                    >
                      {label || value}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {Object.keys(activeFilters).length > 0 && (
              <div className="formGroup" style={{ marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={resetHandler}
                  style={{
                    background: "transparent",
                    color: "#ff6b6b",
                    border: "1px solid #ff6b6b",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
