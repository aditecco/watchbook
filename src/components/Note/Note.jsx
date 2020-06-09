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
        className="NoteContent"
        onChange={e => setInput(e.currentTarget.value)}
        value={input}
        //
      />

      <div className="NoteControls">
        {actions.map(action => (
          <button
            key={action.type}
            className="BaseButton button--outline"
            // type="button"
            onClick={
              action.handler ? () => action.handler(input) : () => setInput("")
            } // the discard handler is managed internally
          >
            <MaterialIcon icon={action.icon} /> {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
