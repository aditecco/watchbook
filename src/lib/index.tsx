/* ---------------------------------
lib
--------------------------------- */

import React from "react";
import { OMDBitem, TagType } from "../types";
import AutoSuggestItem from "../components/AutoSuggestItem/AutoSuggestItem";

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

export function TagContentMapper(onItemClick: (arg: string) => void) {
  return function (tag: TagType, i: number) {
    return (
      <AutoSuggestItem
        key={i}
        clickHander={() => onItemClick(tag.id)}
        label={tag.label}
        desc_1={`${Object.keys(tag.assignedTo ?? {}).length} usages`}
        desc_2={new Date(tag.timestamp)?.toLocaleDateString?.() ?? ""}
      />
    );
  };
}
