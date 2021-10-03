/* ---------------------------------
SearchField
--------------------------------- */

import React, { ReactElement, useState } from "react";
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
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchByID, setSearchByID] = useState<boolean>(false); // TODO make it a config object for advanced search, supporting all APISearchParams options

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);

    focusHandler && focusHandler();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    searchHandler && searchHandler(e, searchByID ? "i" : "s");
  }

  return (
    <form className="itemSearch">
      <div className="wrapper">
        <input
          className={`mainSearchField${error ? " hasError" : ""}`}
          type="text"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === "Escape" && resetHandler()
          }
          placeholder={!isFocused ? "Search for a movie or TV show…" : ""}
          value={searchQuery}
        />

        {/*{isFocused && "advancedSearch"}*/}

        <>
          <label htmlFor="searchByID">search by IMDB ID</label>
          <input
            type="checkbox"
            name={"searchByID"}
            value={String(searchByID)}
            onChange={() => setSearchByID(enabled => !enabled)}
          />
        </>

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
