/* ---------------------------------
AutoSuggest
--------------------------------- */

import React, { ReactElement, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import MaterialIcon from "../Misc/MaterialIcon";
import { OMDBresponse } from "../../types";

interface OwnProps {
  content: OMDBresponse;
  limit: number;
  contentMapper: (item, i: number) => JSX.Element;
}

export default function AutoSuggest({
  content,
  limit,
  contentMapper,
}: OwnProps): ReactElement {
  const [itemsToShow, setItemsToShow] = useState(limit);
  const _content = content?.["Search"] ?? content;
  const l = _content?.length ?? [_content].length;

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
