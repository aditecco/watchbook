/* ---------------------------------
FilterAndSortProvider
--------------------------------- */

import React, { useState, useEffect } from "react";
import { log } from "../../utils";

export default function FilterAndSortProvider({
  children,
  data: initialData,
  FilterAndSortUI,
  queryCallback,
  ...rest
}) {
  // local state
  const [sortQuery, setSortQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [output, setOutput] = useState(initialData);

  //
  const optionsKey = "year"; // TODO abstract 'options', move to props
  const options = removeDuplicates(initialData.map(item => item[optionsKey]));
  const { type, UI, config } = FilterAndSortUI;

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
    console.count(`Processing ${filterQuery || sortQuery}…`);

    setOutput(sortOrFilter(initialData));
  }, [filterQuery, sortQuery]);

  return (
    <>
      <UI
        /**
         * default props
         */

        resetHandler={() => {
          setFilterQuery("");
          setOutput(initialData);
        }}
        /**
         * type-dependent props
         */

        {...(type && type === "combo"
          ? // combo type
            {
              sortHandler: e => {
                setSortQuery(e.target.value);
                queryCallback(e.target.value);
              },
              sortOptions: [`Select a ${optionsKey}`].concat(options),
            }
          : // simple type
            {
              filterHandler: e => setFilterQuery(e.target.value),
              inputValue: filterQuery,
            })}
        /**
         * config props
         */

        {...(config && config)}
        /**
         * other props
         */

        {...rest}
      />

      {children(output)}
    </>
  );
}
