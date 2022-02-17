/* ---------------------------------
SearchField
--------------------------------- */

import React, { PropsWithChildren, ReactElement, useState } from "react";
import MaterialIcon from "../Misc/MaterialIcon";

// TODO
interface OwnProps {
  error: boolean;
  onFocus;
  onReset;
  onSearch;
  placeholder?: string;
  searchQuery: string;
}

export default function SearchField({
  children,
  error,
  onFocus,
  onReset,
  onSearch,
  placeholder,
  searchQuery,
}: PropsWithChildren<OwnProps>): ReactElement {
  const [isFocused, setIsFocused] = useState<boolean>(false);

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);

    onFocus && onFocus();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearch && onSearch(e);
  }

  return (
    <div className="itemSearch">
      <div className="wrapper">
        <input
          className={`mainSearchField${error ? " hasError" : ""}`}
          type="text"
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
            e.key === "Escape" && onReset()
          }
          placeholder={
            !isFocused ? placeholder || "Search for a movie or TV show…" : ""
          }
          value={searchQuery}
        />

        {searchQuery.length ? (
          <button type="button" className="searchCancel" onClick={onReset}>
            <MaterialIcon icon="close" />
          </button>
        ) : null}

        {children}
      </div>
    </div>
  );
}
