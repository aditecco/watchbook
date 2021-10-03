/* ---------------------------------
AutoSuggest
--------------------------------- */

import React, { useState, useEffect, ReactElement } from "react";
import Skeleton from "react-loading-skeleton";
import MaterialIcon from "../Misc/MaterialIcon";
import { OMDBitem, OMDBresponse } from "../../types";

interface OwnProps {
  content: OMDBresponse;
  limit: number;
  onItemClick: (arg: string) => void;
}

export default function AutoSuggest({
  content,
  limit,
  onItemClick,
}: OwnProps): ReactElement {
  const [itemsToShow, setItemsToShow] = useState(limit);
  const _content = content?.["Search"] ?? content;
  const l = _content?.length ?? [_content].length;

  const contentMapper = (searchItem: OMDBitem, i) => (
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

  useEffect(() => {
    // TODO w/ ref
    const app: HTMLDivElement | null = document.querySelector(".App");
    app.style.overflow = "hidden";

    return () => (app.style.overflow = "visible");
  }, []);

  return !_content ? (
    <div className="AutoSuggest">
      <ul className="AutoSuggestContent">
        {Array(5).fill(loadingPlaceholder)}
      </ul>
    </div>
  ) : (
    <div className="AutoSuggest">
      <ul className="AutoSuggestContent">
        {Array.isArray(_content)
          ? _content.slice(0, itemsToShow).map(contentMapper)
          : [_content].map(contentMapper)}

        {itemsToShow < l && (
          <button
            type="button"
            className="AutoSuggestShowMoreButton"
            onClick={() => setItemsToShow(l)}
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
