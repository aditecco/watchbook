/* ---------------------------------
FilterProvider
--------------------------------- */

import React, { useEffect, useState } from "react";
import DataProcessor from "../../DataProcessor";
import { RuntimeFilterLabels } from "../../types";

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

  function handleFilter(
    data,
    filterKey,
    query,
    filterCallback = query => item => item[filterKey] === query
  ) {
    return data.filter(filterCallback(query));
  }

  function runtimeCustomFilter(query) {
    return function (item) {
      function convertToNumber(value) {
        return parseInt(value.split(" ").shift());
      }

      if (!item.runtime) return false;

      switch (query) {
        case RuntimeFilterLabels.UP_TO_30: {
          return convertToNumber(item.runtime) <= 30;
        }

        case RuntimeFilterLabels.UP_TO_60: {
          return convertToNumber(item.runtime) <= 60;
        }

        case RuntimeFilterLabels.UP_TO_90: {
          return convertToNumber(item.runtime) <= 90;
        }

        case RuntimeFilterLabels.UP_TO_100: {
          return convertToNumber(item.runtime) <= 100;
        }

        case RuntimeFilterLabels.UP_TO_120: {
          return convertToNumber(item.runtime) <= 120;
        }

        case RuntimeFilterLabels.UP_TO_180: {
          return convertToNumber(item.runtime) <= 180;
        }

        case RuntimeFilterLabels.UP_TO_200: {
          return convertToNumber(item.runtime) <= 200;
        }

        case RuntimeFilterLabels.UP_TO_300: {
          return convertToNumber(item.runtime) <= 300;
        }

        case RuntimeFilterLabels.MORE_THAN_300: {
          return convertToNumber(item.runtime) > 300;
        }
      }
    };
  }

  /**
   * Returns the pure data, or
   * a sorted/filtered version
   */

  function searchOrFilter(data) {
    if (filterQuery) {
      const [filterKey, query] = filterQuery;

      return handleFilter(
        data,
        filterKey,
        query,
        filterKey === "runtime" ? runtimeCustomFilter : undefined
      );
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
