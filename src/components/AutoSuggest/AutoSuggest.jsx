/* ---------------------------------
AutoSuggest
--------------------------------- */

import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import MaterialIcon from "../Misc/MaterialIcon";

export default function AutoSuggest({ content, limit, onItemClick }) {
  const [itemsToShow, setItemsToShow] = useState(limit);

  useEffect(() => {
    // TODO w/ ref
    const app = document.querySelector(".App");
    app.style.overflow = "hidden";

    return () => (app.style.overflow = "visible");
  }, []);

  return !content ? (
    <div className="AutoSuggest">
      <ul className="AutoSuggestContent">
        {Array(5).fill(loadingPlaceholder)}
      </ul>
    </div>
  ) : (
    <div className="AutoSuggest">
      <ul className="AutoSuggestContent">
        {content.slice(0, itemsToShow).map((searchItem, i) => (
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

        {itemsToShow < content.length && (
          <button
            type="button"
            className="AutoSuggestShowMoreButton"
            onClick={() => setItemsToShow(content.length)}
          >
            <MaterialIcon icon="arrow_forward" /> Show more…
          </button>
        )}
      </ul>
    </div>
  );
}

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
