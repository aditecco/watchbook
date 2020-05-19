/* ---------------------------------
FilterAndSort
--------------------------------- */

import React from "react";
import MaterialIcon from "../../components/Misc/MaterialIcon";

export default function FilterAndSort({
  sortHandler,
  resetHandler,
  sortOptions: options,
  toggleCallback,
}) {
  return (
    <div className="FilterAndSort">
      <button className="closeButton" onClick={toggleCallback}>
        <MaterialIcon icon="close"></MaterialIcon>
      </button>

      <div className="FilterAndSortContainer">
        <div className="wrapper">
          <form className="FilterAndSortForm">
            {Object.entries(options).map(([sortKey, optionsArray], i) => (
              <div className="formGroup" key={`formGroup-${i}`}>
                <label htmlFor={sortKey}>Filter by {sortKey}</label>

                <select
                  onChange={e => sortHandler(e.target.id, e.target.value)}
                  name={`select__${sortKey}`}
                  id={sortKey}
                  className="watchedSort"
                >
                  {optionsArray.map(([value, label], i) => (
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
          </form>
        </div>
      </div>
    </div>
  );
}
