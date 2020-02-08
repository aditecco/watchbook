/* ---------------------------------
AutoSuggest
--------------------------------- */

import React from "react";

export default function AutoSuggest({ content, limit, onItemClick }) {
  return (
    <div className="AutoSuggest">
      <ul className="AutoSuggestContent">
        {content.slice(0, limit).map((searchItem, i) => (
          <li className="AutoSuggestItem" key={i}>
            <a
              className="AutoSuggestItemLinkTarget"
              href={"#"}
              onClick={() => onItemClick(searchItem.imdbID)}
            >
              <h4 className="AutoSuggestItemTitle">{searchItem.Title}</h4>
              <p className="AutoSuggestItemDesc">
                {searchItem.Type}
                {", "}
                {searchItem.Year}
              </p>
            </a>
          </li>
        ))}
        <button type="button" onClick={e => null}>
          Show more…
        </button>
      </ul>
    </div>
  );
}
