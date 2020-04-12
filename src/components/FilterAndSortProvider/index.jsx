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
  // TODO abstract 'options'
  const options = ["Select a year"].concat(initialData.map(item => item.year));

  /**
   * Filter handler
   */

  function handleFilter(data, query) {
    const lowercased = item => item.toLowerCase();
    const _query = lowercased(query);

    return data.filter(item => lowercased(item.title).includes(_query));
  }

  /**
   * Sort handler
   */

  function handleSort(data, query) {
    // TODO abstract 'year'
    return data.filter(item => item.year === query);
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
          sortOptions={options}
        />
      )}

      {children(output)}
    </>
  );
}
