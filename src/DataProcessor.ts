/* ---------------------------------
dataProcessor
--------------------------------- */

import { removeDuplicates } from "./utils";
import { FilterOption, RuntimeFilterLabels } from "./types";

type SortFn = (a: string, b: string) => number;

export default class DataProcessor {
  // https://stackoverflow.com/questions/48657481/in-javascript-is-constructor-mandatory-in-a-class

  /**
   * Primes data by performing
   * common operations
   */

  primeData(data: string[], sortFn?: SortFn): string[] {
    return removeDuplicates(data).sort(sortFn);
  }

  finalizeData(data: FilterOption[], sortKey: string): FilterOption[] {
    return [["", `Select a ${sortKey}`]].concat(data);
  }

  applyGenericProcessing(data: string[], sortKey: string): FilterOption[] {
    return this.finalizeData(
      this.primeData(data).map((el) => [el]),
      sortKey,
    );
  }

  /**
   * Handles the 'director' type
   *
   * TODO
   fine-tune to also handle
   multiple directors &
   multiple first names
   */

  director(data: string[], sortKey: string): FilterOption[] {
    function invertOrder(name: string) {
      const split = name.split(" ");

      if (split.length === 2) {
        // Woody Allen => Allen Woody
        return split.reverse().join(" ");
      }

      return name;
    }

    return this.finalizeData(
      this.primeData(data)
        .map(invertOrder)
        .sort() // by sorting with inverse order, we achieve ordering by last name
        .map((lastFirst) => {
          const split = lastFirst.split(" ");

          switch (split.length) {
            /**
             * Default case:
             *
             * *************************************************
             * | orig value  |   input value   |   UI label    |
             * *************************************************
             *
             * Last First => [ [ First Last ], [ Last, First ] ]
             *
             * *************************************************
             *
             */
            case 2: {
              return [
                // Allen Woody => Woody Allen
                [...split].reverse().join(" "),

                // Allen Woody => Allen, Woody
                [...split]
                  .map((part, i) => (i === 1 ? part : part + ", "))
                  .join(" "),
              ];
            }

            default:
              return [lastFirst];
          }
        }),
      //
      sortKey,
    );
  }

  /**
   * handles the 'year' type
   *
   * TODO
   * - remove dashes
   * - remove ranges
   */

  year(data: string[], sortKey: string): FilterOption[] {
    return this.applyGenericProcessing(data, sortKey).filter(
      (year) => !year[0].includes("–"),
    );
  }

  /**
   * handles the 'country' type
   */

  country(data: string[], sortKey: string): FilterOption[] {
    return this.applyGenericProcessing(data, sortKey);
  }

  /**
   * handles the 'genre' type
   */

  genre(data: string[], sortKey: string): FilterOption[] {
    return this.applyGenericProcessing(data, sortKey);
  }

  /**
   * handles the 'type' type
   */

  type(data: string[], sortKey: string): FilterOption[] {
    return this.applyGenericProcessing(data, sortKey);
  }

  /**
   * handles the 'runtime' type (fixed buckets; the data is ignored)
   */

  runtime(_data: string[], sortKey: string): FilterOption[] {
    const buckets = [
      RuntimeFilterLabels.UP_TO_30,
      RuntimeFilterLabels.UP_TO_60,
      RuntimeFilterLabels.UP_TO_90,
      RuntimeFilterLabels.UP_TO_100,
      RuntimeFilterLabels.UP_TO_120,
      RuntimeFilterLabels.UP_TO_180,
      RuntimeFilterLabels.UP_TO_200,
      RuntimeFilterLabels.UP_TO_300,
      RuntimeFilterLabels.MORE_THAN_300,
    ];

    function firstNumber(label: string) {
      return parseInt(label.match(/\d+/)?.[0] ?? "0");
    }

    function sortByNumberAsc(a: string, b: string) {
      return firstNumber(a) - firstNumber(b);
    }

    return this.finalizeData(
      this.primeData(buckets, sortByNumberAsc).map((el) => [el]),
      sortKey,
    );
  }
}
