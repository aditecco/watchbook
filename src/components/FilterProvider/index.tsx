/* ---------------------------------
FilterProvider
--------------------------------- */

import React, { ComponentType, ReactNode, useEffect, useState } from "react";
import DataProcessor from "../../DataProcessor";
import type { FilterAndSortProps } from "../FilterAndSort/FilterAndSort";
import type { QuickSearchProps } from "../QuickSearch/QuickSearch";
import {
  ActiveFilters,
  FilterableItem,
  FilterOptions,
  FilterQuery,
  FilterSortKey,
  RuntimeFilterLabels,
} from "../../types";

const processor = new DataProcessor();

type FilterUIConfig =
  | {
      type: "simple";
      UI: ComponentType<QuickSearchProps>;
      config: { placeholder?: string };
    }
  | {
      type: "combo";
      UI: ComponentType<FilterAndSortProps>;
      config: { sortKeys: FilterSortKey[]; toggleCallback: () => void };
    };

type FilterProviderProps<T extends FilterableItem> = {
  children: (output: T[]) => ReactNode;
  data: T[];
  FilterUI: FilterUIConfig;
  queryCallback?: (query: FilterQuery) => void;
  remoteReset?: boolean;
};

export default function FilterProvider<T extends FilterableItem>({
  children,
  data: initialData,
  FilterUI,
  queryCallback,
  remoteReset,
}: FilterProviderProps<T>) {
  // local state - changed to support multiple additive filters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [output, setOutput] = useState<T[]>([]);

  const options =
    FilterUI.type === "combo"
      ? FilterUI.config.sortKeys.reduce<FilterOptions>((acc, sortKey) => {
          acc[sortKey] = processor[sortKey].bind(processor)(
            extractOptions(initialData, sortKey),
            sortKey,
          );

          return acc;
        }, {})
      : undefined;

  /**
   * Extracts options, providing a searchable
   * placeholder in case of missing value
   */

  function extractOptions(data: T[], key: FilterSortKey): string[] {
    return data.map((item) => (item[key] as string | null | undefined) || "N/A");
  }

  /**
   * Search handler
   */

  function handleSearch(data: T[], query: string) {
    // TODO throttle/debounce
    return data.filter((item) =>
      item?.title?.toLowerCase?.()?.includes?.(query.toLowerCase()),
    );
  }

  /**
   * Filter handler
   */

  function handleFilter(
    data: T[],
    filterKey: string,
    query: string,
    filterCallback = (query: string) => (item: T) => item[filterKey] === query,
  ) {
    return data.filter(filterCallback(query));
  }

  function runtimeCustomFilter(query: string) {
    return function (item: T): boolean {
      function convertToNumber(value: string) {
        return parseInt(value.split(" ")[0]);
      }

      if (!item.runtime) return false;
      const minutes = convertToNumber(item.runtime);

      switch (query) {
        case RuntimeFilterLabels.UP_TO_30: {
          return minutes <= 30;
        }

        case RuntimeFilterLabels.UP_TO_60: {
          return minutes <= 60;
        }

        case RuntimeFilterLabels.UP_TO_90: {
          return minutes <= 90;
        }

        case RuntimeFilterLabels.UP_TO_100: {
          return minutes <= 100;
        }

        case RuntimeFilterLabels.UP_TO_120: {
          return minutes <= 120;
        }

        case RuntimeFilterLabels.UP_TO_180: {
          return minutes <= 180;
        }

        case RuntimeFilterLabels.UP_TO_200: {
          return minutes <= 200;
        }

        case RuntimeFilterLabels.UP_TO_300: {
          return minutes <= 300;
        }

        case RuntimeFilterLabels.MORE_THAN_300: {
          return minutes > 300;
        }

        default:
          return false;
      }
    };
  }

  /**
   * Returns the pure data, or
   * a sorted/filtered version with additive filters
   */

  function searchOrFilter(data: T[]) {
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

  const handleFilterChange = (filterKey: string, value: string) => {
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
      {FilterUI.type === "combo" ? (
        <FilterUI.UI
          resetHandler={handleReset}
          sortHandler={handleFilterChange}
          sortOptions={options ?? {}}
          activeFilters={activeFilters}
          {...FilterUI.config}
        />
      ) : (
        <FilterUI.UI
          resetHandler={handleReset}
          filterHandler={(e) => {
            const newQuery = e.target.value;
            setSearchQuery(newQuery);
            // Also notify parent of search query changes
            if (queryCallback) {
              queryCallback({
                activeFilters: activeFilters,
                searchQuery: newQuery,
              });
            }
          }}
          inputValue={searchQuery}
          {...FilterUI.config}
        />
      )}

      {children(output)}
    </>
  );
}
