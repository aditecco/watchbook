/* ---------------------------------
AutoSuggest
--------------------------------- */

import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { rand } from "../../utils";

export default function AutoSuggest({ content, limit, onItemClick }) {
  const [loading, setLoading] = useState(true);

  const loadingPlaceholder = (
    <li className="AutoSuggestItem wrapper">
      <div className="AutoSuggestItemLinkTarget">
        <h4 className="AutoSuggestItemTitle">
          <Skeleton />
        </h4>

        <p className="AutoSuggestItemDesc">
          <span className="ItemType">
            <Skeleton />
          </span>

          <span className="ItemYear">
            <Skeleton />
          </span>
        </p>
      </div>
    </li>
  );

  useEffect(() => {
    content && setLoading(false);

    return () => setLoading(true);
  }, [content]);

  return loading ? (
    <div className="AutoSuggest">
      <ul className="AutoSuggestContent">
        {Array(5).fill(loadingPlaceholder)}
      </ul>
    </div>
  ) : (
    <div className="AutoSuggest">
      <ul className="AutoSuggestContent">
        {content.slice(0, limit).map((searchItem, i) => (
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
        ))}
        <button type="button" onClick={e => null}>
          Show more…
        </button>
      </ul>
    </div>
  );
}
