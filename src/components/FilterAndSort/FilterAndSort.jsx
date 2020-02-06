/* ---------------------------------
FilterAndSort
--------------------------------- */

import React from "react";

export default function FilterAndSort({ filterHandler }) {
  return (
    <div className="FilterAndSort">
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
            onChange={e => null}
            onSelect={e => null}
            name=""
            id="watchedSearchSort"
            className="watchedSort"
          >
            <option value="">Year</option>
            <option value="1958">1958</option>
            <option value="1963">1963</option>
          </select>
        </div>
      </form>
    </div>
  );
}
