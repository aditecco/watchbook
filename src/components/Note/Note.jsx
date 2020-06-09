/* ---------------------------------
Note
--------------------------------- */

import React, { useState } from "react";
import { log } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";

export default function Note({ actions, content }) {
  const [input, setInput] = useState(content || "");

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
          onClick={
            action.handler ? () => action.handler(input) : () => setInput("")
          } // the discard handler is managed internally
        >
          {action.label} <MaterialIcon icon={action.icon} />
        </button>
      ))}
    </div>
  );
}
