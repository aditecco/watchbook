/* ---------------------------------
AutoSuggestItem
--------------------------------- */

import * as React from "react";
import { PropsWithChildren, ReactElement } from "react";

type OwnProps = {
  clickHander: () => void;
  label: string;
  desc_1: string;
  desc_2: string;
};

export default function AutoSuggestItem({
  clickHander,
  label,
  desc_1,
  desc_2,
}: PropsWithChildren<OwnProps>): ReactElement {
  return (
    <li className="AutoSuggestItem wrapper">
      <div className="AutoSuggestItemLinkTarget" onClick={clickHander}>
        <h4 className="AutoSuggestItemTitle">{label}</h4>

        <p className="AutoSuggestItemDesc">
          <span className="ItemType">{desc_1}</span>
          {", "}
          <span className="ItemYear">{desc_2}</span>
        </p>
      </div>
    </li>
  );
}
