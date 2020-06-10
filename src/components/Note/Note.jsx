/* ---------------------------------
Note
--------------------------------- */

import React, { useState } from "react";
import { log } from "../../utils";
import MaterialIcon from "../Misc/MaterialIcon";

export default function Note({
  actions,
  content,
  itemTitle,
  //
}) {
  const [input, setInput] = useState(
    content || `Create a note for ${itemTitle}…`
  );

  return (
    <div className="Note">
      <textarea
        className="NoteContent"
        onChange={e => setInput(e.currentTarget.value)}
        value={input}
        onClick={!content ? () => setInput("") : null}
        //
      />

      <div className="NoteControls">
        {actions.map((action, i) => (
          <button
            key={action.type}
            className={`BaseButton${i === 0 ? " button--outline" : ""}`}
            type="button"
            onClick={
              action.type !== "discard"
                ? () => action.handler(input)
                : () => {
                    setInput("");
                    action.handler();
                  }
            } // the discard handler is managed internally
          >
            <MaterialIcon icon={action.icon} /> {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
