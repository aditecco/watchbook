/* ---------------------------------
FilterAndSortProvider
--------------------------------- */

import React, { useState, useEffect } from "react";
import dataProcessor from "../../dataProcessor";

export default function FilterAndSortProvider({
  children,
  data: initialData,
  FilterAndSortUI,
  queryCallback,
  ...rest
}) {
  // local state
  const [sortQuery, setSortQuery] = useState(null);
  const [filterQuery, setFilterQuery] = useState("");
  const [output, setOutput] = useState(initialData);

  //
  const { type, UI, config } = FilterAndSortUI;
  const processor = new dataProcessor();

  const options =
    config.sortKeys &&
    config.sortKeys.reduce((acc, sortKey) => {
      acc[sortKey] = processor[sortKey].bind(processor)(
        extractOptions(initialData, sortKey),
        sortKey
      );

      return acc;
    }, {});

  /**
   * Extracts options, providing a searchable
   * placeholder in case of missing value
   */

  function extractOptions(data, key) {
    return data.map(item => item[key] || "N/A");
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

  // TODO rename: it's not a sort!
  function handleSort(data, sortKey, query) {
    return data.filter(item => item[sortKey] === query);
  }

  /**
   * Returns the pure data, or
   * a sorted/filtered version
   */

  function sortOrFilter(data) {
    if (sortQuery) {
      const [sortKey, query] = sortQuery;

      return handleSort(data, sortKey, query);
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
              sortHandler: (id, value) => {
                setSortQuery([id, value]);
                queryCallback(value);
              },
              sortOptions: options,
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
