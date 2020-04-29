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
  children,
  error,
}) {
  return (
    <form className="itemSearch">
      <div className="wrapper">
        <input
          className={`mainSearchField${error ? " hasError" : ""}`}
          type="text"
          onChange={searchHandler}
          onFocus={focusHandler}
          onKeyDown={e =>
            (e.key === "Escape" || e.code === "Escape") && resetHandler()
          }
          placeholder="Search for a movie or TV show…"
          value={searchQuery}
        />

        <button
          type="button"
          className="searchCancel"
          style={{
            display: `${!searchQuery.length ? "none" : "inline-block"}`,
          }}
          onClick={resetHandler}
        >
          <MaterialIcon icon="close" />
        </button>

        {children}
      </div>
    </form>
  );
}
