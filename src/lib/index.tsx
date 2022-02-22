/* ---------------------------------
lib
--------------------------------- */

import React from "react";
import { OMDBitem, TagType } from "../types";

export function OMDBcontentMapper(onItemClick: (arg: string) => void) {
  return function (searchItem: OMDBitem, i: number) {
    return (
      <li className="AutoSuggestItem wrapper" key={i}>
        <div
          className="AutoSuggestItemLinkTarget"
          onClick={() => onItemClick(searchItem.imdbID)}
        >
          <h4 className="AutoSuggestItemTitle">{searchItem.Title}</h4>

          <p className="AutoSuggestItemDesc">
            <span className="ItemType">{searchItem.Type}</span>
            {", "}
            <span className="ItemYear">{searchItem.Year}</span>
          </p>
        </div>
      </li>
    );
  };
}

export function TagContentMapper(onItemClick: (arg: string) => void) {
  return function (tag: TagType, i: number) {
    return (
      <li className="AutoSuggestItem wrapper" key={i}>
        <div
          className="AutoSuggestItemLinkTarget"
          onClick={() => onItemClick(tag.id)}
        >
          <h4 className="AutoSuggestItemTitle">{tag.label}</h4>

          <p className="AutoSuggestItemDesc">
            <span className="ItemType">
              {Object.keys(tag.assignedTo ?? {}).length} usages
            </span>
            {", "}
            <span className="ItemYear">
              {new Date(tag.timestamp)?.toLocaleDateString?.()}
            </span>
          </p>
        </div>
      </li>
    );
  };
}
