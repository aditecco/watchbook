/* ---------------------------------
FilterAndSortProvider
--------------------------------- */

import React from "react";

export default function FilterAndSortProvider({
  children,
  data,
  FilterAndSortComponent,
  handlers,
  toggleUI,
}) {
  const { filter, sort } = handlers;

  return (
    <>
      {toggleUI && (
        <FilterAndSortComponent
          filterHandler={filter}
          sortHandler={sort}
          sortOptions={[1, 2, 3]}
        />
      )}
      {children(data)}
    </>
  );
}
