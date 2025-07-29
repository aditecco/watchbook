/* ---------------------------------
lib
--------------------------------- */

import React from "react";
import AutoSuggestItem from "@/components/AutoSuggestItem/AutoSuggestItem";

// OMDB search result item interface
export interface OMDBitem {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export function OMDBcontentMapper(onItemClick: (arg: string) => void) {
  return function (searchItem: OMDBitem, i: number) {
    return (
      <AutoSuggestItem
        key={i}
        clickHander={() => onItemClick(searchItem.imdbID)}
        label={searchItem.Title}
        desc_1={searchItem.Type}
        desc_2={searchItem.Year}
      />
    );
  };
}
