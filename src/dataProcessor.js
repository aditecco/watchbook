/* ---------------------------------
dataProcessor
--------------------------------- */

import { removeDuplicates } from "./utils";

export default class dataProcessor {
  /**
   * Primes data by performing
   * common operations
   */

  primeData(data, sortFn) {
    return removeDuplicates(data).sort(sortFn);
  }

  finalizeData(data, sortKey) {
    return [["", `Select a ${sortKey}`]].concat(data);
  }

  generic(data, sortKey) {
    return this.finalizeData(
      this.primeData(data).map(el => [el]),
      sortKey
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
    return this.finalizeData(
      this.primeData(data).map(el => {
        const split = el.split(" ");

        switch (split.length) {
          /**
           * Default case:
           * First Last => Last, F.
           */
          case 2: {
            return [
              el,
              split
                .reverse()
                .map((part, i) =>
                  i === 1 ? part.charAt(0).toUpperCase() + "." : part + ", "
                )
                .join(" "),
            ];
          }

          default:
            return [el];
        }
      }),
      //
      sortKey
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
    return this.generic(data, sortKey);
  }

  /**
   * handles the 'country' type
   */

  country(data, sortKey) {
    return this.generic(data, sortKey);
  }

  /**
   * handles the 'genre' type
   */

  genre(data, sortKey) {
    return this.generic(data, sortKey);
  }

  /**
   * handles the 'type' type
   */

  type(data, sortKey) {
    return this.generic(data, sortKey);
  }
}
