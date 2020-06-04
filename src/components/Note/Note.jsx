/* ---------------------------------
Note
--------------------------------- */

import React, { useState } from "react";
import CardControls from "../Card/CardControls";
import { log } from "../../utils";

export default function Note({}) {
  const [input, setInput] = useState("");

  return (
    <div className="Note">
      <textarea
        onChange={e => setInput(e.currentTarget.value)}
        value={input}
        //
      />

      <CardControls
        handlers={[
          //
          () => log(input),
          () => log("discard"),
        ]}
        labels={["Save note", "Discard"]}
        icons={[]}
      />
    </div>
  );
}
