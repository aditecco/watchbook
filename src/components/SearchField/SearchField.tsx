/* ---------------------------------
SearchField
--------------------------------- */

import React, { ReactElement } from "react";
import MaterialIcon from "../Misc/MaterialIcon";

// TODO
interface OwnProps {
  children?;
  error;
  focusHandler;
  resetHandler;
  searchHandler;
  searchQuery;
}

export default function SearchField({
  children,
  error,
  focusHandler,
  resetHandler,
  searchHandler,
  searchQuery,
}: OwnProps): ReactElement {
  return (
    <form className="itemSearch">
      <div className="wrapper">
        <input
          className={`mainSearchField${error ? " hasError" : ""}`}
          type="text"
          onChange={searchHandler}
          onFocus={focusHandler}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === "Escape" && resetHandler()
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
