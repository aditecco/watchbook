/* ---------------------------------
Tabs
--------------------------------- */

import React, { ReactElement, useState } from "react";

// TODO
export default function TabSwitcher({ tabs }: { tabs: any[] }): ReactElement {
  const [selected, setSelected] = useState(0);

  return (
    <div className="TabSwitcher">
      <div className="TabHeader">
        {tabs.map((tab, k) => (
          <button
            key={k}
            type="button"
            className={`TabButton ${
              selected === k ? "TabButton--selected" : ""
            }`}
            onClick={() => setSelected(k)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="TabContent">{tabs[selected]["content"]}</div>
    </div>
  );
}
