/* ---------------------------------
SearchField
--------------------------------- */

import React, { PropsWithChildren, ReactElement, useState } from "react";
import { InputValidator } from "@/lib/validation";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

interface OwnProps {
  error: boolean;
  onFocus?: () => void;
  onReset?: () => void;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    const value = e.currentTarget.value;

    // Validate search term
    const searchValidation = InputValidator.validateSearchTerm(value);

    // Only allow valid search terms or empty strings
    if (searchValidation.isValid || value === "") {
      onSearch && onSearch(e);
    }
    // If invalid, you could show a warning or truncate the input
    // For now, we'll just prevent the invalid input
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
            e.key === "Escape" && onReset && onReset()
          }
          placeholder={
            !isFocused ? placeholder || "Search for a movie or TV show…" : ""
          }
          value={searchQuery}
          maxLength={100} // Prevent extremely long search terms
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
