/* ---------------------------------
FilterAndSort
--------------------------------- */

import React from "react";
import MaterialIcon from "../../components/Misc/MaterialIcon";

export default function FilterAndSort({
  filterHandler,
  sortHandler,
  resetHandler,
  inputValue,
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
            {/* <div className="formGroup"></div> */}

            <div className="formGroup">
              <label htmlFor="watchedSearchSort">Filter by year</label>
              <select
                onChange={sortHandler}
                // onSelect={sortHandler}
                name="sortKeySelector"
                id="watchedSearchSort"
                className="watchedSort"
              >
                {[...options]
                  .sort((a, b) => a - b)
                  .map((option, i) => (
                    <option value={i === 0 ? "" : option} key={option + i}>
                      {option}
                    </option>
                  ))}
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
