/* ---------------------------------
AutoSuggest
--------------------------------- */

import React, { CSSProperties, ReactElement, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

// import { OMDBresponse } from "../../types";

interface OwnProps {
  content: unknown;
  limit: number;
  contentMapper: (item: any, i: number) => ReactElement;
  style?: CSSProperties;
  fetching?: boolean;
}

export default function AutoSuggest({
  content,
  limit,
  contentMapper,
  style,
  fetching = false,
}: OwnProps): ReactElement {
  const [itemsToShow, setItemsToShow] = useState(limit);
  const _content = (content as any)?.["Search"] ?? content; // TODO
  const l = _content?.length ?? [_content].length;

  useEffect(() => {
    // Prevent body scroll when AutoSuggest is visible
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return fetching ? (
    <div className="AutoSuggest" style={style ?? {}}>
      <ul className="AutoSuggestContent">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <li key={`skeleton-${index}`} className="AutoSuggestItem wrapper">
              <div className="AutoSuggestItemLinkTarget">
                <h4 className="AutoSuggestItemTitle">
                  <Skeleton height={20} />
                </h4>

                <p className="AutoSuggestItemDesc">
                  <span className="ItemType">
                    <Skeleton width={60} height={16} />
                  </span>
                  {", "}
                  <span className="ItemYear">
                    <Skeleton width={40} height={16} />
                  </span>
                </p>
              </div>
            </li>
          ))}
      </ul>
    </div>
  ) : (
    <div className="AutoSuggest" style={style ?? {}}>
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
