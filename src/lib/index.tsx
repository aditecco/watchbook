/* ---------------------------------
lib
--------------------------------- */

import React from "react";
import { OMDBitem } from "../types";

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
