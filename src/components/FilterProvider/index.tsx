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
  // local state - changed to support multiple additive filters
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [output, setOutput] = useState([]);

  const { type, UI, config } = FilterUI;

  const options =
    config.sortKeys &&
    config.sortKeys.reduce((acc, sortKey) => {
      acc[sortKey] = processor[sortKey].bind(processor)(
        extractOptions(initialData, sortKey),
        sortKey,
      );

      return acc;
    }, {});

  /**
   * Extracts options, providing a searchable
   * placeholder in case of missing value
   */

  function extractOptions(data, key) {
    return data.map((item) => item[key] || "N/A");
  }

  /**
   * Search handler
   */

  function handleSearch(data, query) {
    // TODO throttle/debounce
    return data.filter((item) =>
      item?.title?.toLowerCase?.()?.includes?.(query.toLowerCase()),
    );
  }

  /**
   * Filter handler
   */

  function handleFilter(
    data,
    filterKey,
    query,
    filterCallback = (query) => (item) => item[filterKey] === query,
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
   * a sorted/filtered version with additive filters
   */

  function searchOrFilter(data) {
    let filteredData = data;

    // Apply search query first if exists
    if (searchQuery) {
      filteredData = handleSearch(filteredData, searchQuery);
    }

    // Apply all active filters additively
    Object.entries(activeFilters).forEach(([filterKey, query]) => {
      if (query && query !== "") {
        filteredData = handleFilter(
          filteredData,
          filterKey,
          query,
          filterKey === "runtime" ? runtimeCustomFilter : undefined,
        );
      }
    });

    return filteredData;
  }

  useEffect(() => {
    initialData && initialData.length && setOutput(initialData);
  }, [initialData]);

  useEffect(() => {
    const hasActiveFilters = Object.values(activeFilters).some(
      (value) => value && value !== "",
    );
    console.count(
      `Processing search: "${searchQuery}", filters: ${hasActiveFilters ? JSON.stringify(activeFilters) : "none"}…`,
    );

    setOutput(searchOrFilter(initialData));
  }, [searchQuery, activeFilters]);

  useEffect(() => {
    if (remoteReset) {
      setSearchQuery("");
      setActiveFilters({});
      setOutput(initialData);
    }
  }, [remoteReset]);

  const handleFilterChange = (filterKey, value) => {
    setActiveFilters((prev) => {
      const newFilters = { ...prev };

      if (value && value !== "") {
        newFilters[filterKey] = value;
      } else {
        delete newFilters[filterKey];
      }

      // Call queryCallback with all active filters and search query
      if (queryCallback) {
        queryCallback({
          activeFilters: newFilters,
          searchQuery: searchQuery,
        });
      }

      return newFilters;
    });
  };

  const handleReset = () => {
    setSearchQuery("");
    setActiveFilters({});
    setOutput(initialData);

    // Notify parent that all filters are cleared
    if (queryCallback) {
      queryCallback({
        activeFilters: {},
        searchQuery: "",
      });
    }
  };

  return (
    <>
      <UI
        /**
         * default props
         */

        resetHandler={handleReset}
        /**
         * type-dependent props
         */

        {...(type && type === "combo"
          ? // combo type
            {
              sortHandler: handleFilterChange,
              sortOptions: options,
              activeFilters: activeFilters,
            }
          : // simple type
            {
              filterHandler: (e) => {
                const newQuery = e.target.value;
                setSearchQuery(newQuery);
                // Also notify parent of search query changes
                if (queryCallback) {
                  queryCallback({
                    activeFilters: activeFilters,
                    searchQuery: newQuery,
                  });
                }
              },
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
