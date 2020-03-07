/* ---------------------------------
SearchField
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";

export default function SearchField({
  searchHandler,
  focusHandler,
  resetHandler,
  searchQuery,
  children
}) {
  return (
    <form className="itemSearch">
      <>
        <input
          className="mainSearchField"
          type="text"
          onChange={searchHandler}
          onFocus={focusHandler}
          placeholder="Search for a movie or TV show…"
          value={searchQuery}
        />

        <button
          type="button"
          className="searchCancel"
          style={{
            display: `${!searchQuery.length ? "none" : "inline-block"}`
          }}
          onClick={resetHandler}
        >
          <MaterialIcon icon="close" />
        </button>

        {children}
      </>
    </form>
  );
}
