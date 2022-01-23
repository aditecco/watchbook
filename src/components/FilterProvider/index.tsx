/* ---------------------------------
FilterProvider
--------------------------------- */

import React, { useEffect, useState } from "react";
import DataProcessor from "../../DataProcessor";

const processor = new DataProcessor();

export default function FilterProvider({
  children,
  data: initialData,
  FilterUI,
  queryCallback,
  remoteReset,
  ...rest
}) {
  // local state
  const [filterQuery, setFilterQuery] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [output, setOutput] = useState([]);

  const { type, UI, config } = FilterUI;

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
   * Search handler
   */

  function handleSearch(data, query) {
    // TODO throttle/debounce
    return data.filter(item =>
      item?.title?.toLowerCase?.()?.includes?.(query.toLowerCase())
    );
  }

  /**
   * Filter handler
   */

  function handleFilter(data, sortKey, query) {
    return data.filter(item => item[sortKey] === query);
  }

  /**
   * Returns the pure data, or
   * a sorted/filtered version
   */

  function searchOrFilter(data) {
    if (filterQuery) {
      const [sortKey, query] = filterQuery;

      return handleFilter(data, sortKey, query);
    }

    if (searchQuery) {
      return handleSearch(data, searchQuery);
    }

    // the unaltered initial data
    return initialData;
  }

  useEffect(() => {
    initialData && initialData.length && setOutput(initialData);
  }, [initialData]);

  useEffect(() => {
    console.count(`Processing ${searchQuery || filterQuery}…`);

    setOutput(searchOrFilter(initialData));
  }, [searchQuery, filterQuery]);

  useEffect(() => {
    if (remoteReset) {
      setSearchQuery("");
      setOutput(initialData);
    }
  }, [remoteReset]);

  return (
    <>
      <UI
        /**
         * default props
         */

        resetHandler={() => {
          setSearchQuery("");
          setOutput(initialData);
        }}
        /**
         * type-dependent props
         */

        {...(type && type === "combo"
          ? // combo type
            {
              sortHandler: (id, value) => {
                setFilterQuery([id, value]);
                queryCallback(value);
              },
              sortOptions: options,
            }
          : // simple type
            {
              filterHandler: e => setSearchQuery(e.target.value),
              inputValue: searchQuery,
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
