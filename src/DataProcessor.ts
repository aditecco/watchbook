/* ---------------------------------
dataProcessor
--------------------------------- */

import { removeDuplicates } from "./utils";
import { RuntimeFilterLabels } from "./types";

export default class DataProcessor {
  // https://stackoverflow.com/questions/48657481/in-javascript-is-constructor-mandatory-in-a-class

  /**
   * Primes data by performing
   * common operations
   */

  primeData(data, sortFn = undefined) {
    return removeDuplicates(data).sort(sortFn);
  }

  finalizeData(data, sortKey) {
    return [["", `Select a ${sortKey}`]].concat(data);
  }

  applyGenericProcessing(data, sortKey) {
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

  director(data, sortKey) {
    function invertOrder(data) {
      const split = data.split(" ");

      if (split.length === 2) {
        // Woody Allen => Allen Woody
        return split.reverse().join(" ");
      }

      return data;
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

  year(data, sortKey) {
    return this.applyGenericProcessing(data, sortKey).filter(
      (year) => !year[0].includes("–"),
    );
  }

  /**
   * handles the 'country' type
   */

  country(data, sortKey) {
    return this.applyGenericProcessing(data, sortKey);
  }

  /**
   * handles the 'genre' type
   */

  genre(data, sortKey) {
    return this.applyGenericProcessing(data, sortKey);
  }

  /**
   * handles the 'type' type
   */

  type(data, sortKey) {
    return this.applyGenericProcessing(data, sortKey);
  }

  /**
   * handles the 'runtime' type
   */

  runtime(data, sortKey) {
    data = [
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

    function sortByNumberAsc(a, b) {
      const _a = parseInt(a.match(/[\d]+/)[0]);
      const _b = parseInt(b.match(/[\d]+/)[0]);

      return _a - _b;
    }

    return this.finalizeData(
      this.primeData(data, sortByNumberAsc).map((el) => [el]),
      sortKey,
    );
  }
}
