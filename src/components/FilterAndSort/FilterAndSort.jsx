/* ---------------------------------
FilterAndSort
--------------------------------- */

import React from "react";

export default function FilterAndSort({
  filterHandler,
  sortHandler,
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
            />
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
