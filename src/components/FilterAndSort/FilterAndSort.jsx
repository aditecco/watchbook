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
}) {
  return (
    <div className="FilterAndSort">
      <div className="wrapper">
        <form action="" className="FilterAndSortForm">
          <div className="formGroup formGroup__filter">
            <label htmlFor="watchedSearchFilter">Filter</label>

            <input
              id="watchedSearchFilter"
              type="text"
              className="watchedFilter"
              onChange={filterHandler}
              placeholder="Filter by name"
              value={inputValue}
            />

            <button
              type="button"
              className="filterCancel"
              // TODO appear when query is present
              // style={{
              //   display: `${!searchQuery.length ? "none" : "inline-block"}`,
              // }}
              onClick={resetHandler}
            >
              <MaterialIcon icon="close" />
            </button>
          </div>

          <div className="formGroup formGroup__sort">
            <label htmlFor="watchedSearchSort">Sort by year</label>
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
  );
}
