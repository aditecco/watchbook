/* ---------------------------------
dataProcessors
--------------------------------- */

const dataProcessors = {
  director(firstLast) {
    const split = firstLast.split(" ");

    /* TODO
      fine-tune to also handle
      multiple directors &
      multiple first names
    */

    switch (split.length) {
      /**
       * Default case:
       * First Last => Last, F.
       */
      case 2: {
        return [
          firstLast,
          split
            .reverse()
            .map((part, i) =>
              i === 1 ? part.charAt(0).toUpperCase() + "." : part + ", "
            )
            .join(" "),
        ];
      }

      default:
        return [firstLast];
    }
  },

  /**
   * TODO
   * - remove dashes
   * - remove ranges
   */
  year(data) {
    return [data];
  },
  country(data) {
    return [data];
  },
  genre(data) {
    return [data];
  },
};

export default dataProcessors;
