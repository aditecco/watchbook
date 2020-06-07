/* ---------------------------------
Note
--------------------------------- */

import React, { useState } from "react";
import CardControls from "../Card/CardControls";
import { log } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";

export default function Note({ actions }) {
  const [input, setInput] = useState("");

  return (
    <div className="Note">
      <textarea
        onChange={e => setInput(e.currentTarget.value)}
        value={input}
        //
      />

      {actions.map(action => (
        <button
          key={action.type}
          className="BaseButton button--outline"
          type="button"
          onClick={action.handler || (() => setInput(""))} // the discard handler is managed internally
        >
          {action.label}
          <MaterialIcon icon={action.icon} />
        </button>
      ))}
    </div>
  );
}
