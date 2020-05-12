/* ---------------------------------
FilterAndSortProvider
--------------------------------- */

import React, { useState, useEffect } from "react";
import { log } from "../../utils";

export default function FilterAndSortProvider({
  children,
  data: initialData,
  FilterAndSortUI,
  handlers,
  toggleUI,
}) {
  const [sortQuery, setSortQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [output, setOutput] = useState(initialData);
  const optionsKey = "year"; // TODO abstract 'options', move to props
  const options = removeDuplicates(initialData.map(item => item[optionsKey]));

  /**
   * Removes dupes from a dataset
   */

  function removeDuplicates(data) {
    return [...new Set(data)];
  }

  /**
   * Filter handler
   */

  function handleFilter(data, query) {
    // TODO throttle/debounce
    return data.filter(
      item =>
        item.title && item.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  /**
   * Sort handler
   */

  function handleSort(data, query) {
    // TODO abstract 'year'
    return data.filter(item => item[optionsKey] === query);
  }

  /**
   * Returns the pure data, or
   * a sorted/filtered version
   */

  function sortOrFilter(data) {
    if (sortQuery) {
      return handleSort(data, sortQuery);
    }

    if (filterQuery) {
      return handleFilter(data, filterQuery);
    }

    // the unaltered initial data
    return initialData;
  }

  useEffect(() => {
    console.count("Running useEffect…");

    setOutput(sortOrFilter(initialData));
  }, [filterQuery, sortQuery]);

  return (
    <>
      {toggleUI && (
        <FilterAndSortUI
          filterHandler={e => setFilterQuery(e.target.value)}
          sortHandler={e => setSortQuery(e.target.value)}
          resetHandler={() => {
            setFilterQuery("");
            setOutput(initialData);
          }}
          inputValue={filterQuery}
          sortOptions={[`Select a ${optionsKey}`].concat(options)}
        />
      )}

      {children(output)}
    </>
  );
}
