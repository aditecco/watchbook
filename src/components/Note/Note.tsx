/* ---------------------------------
Note
--------------------------------- */

import React, { ReactElement, useState } from "react";
import { InputValidator } from "@/lib/validation";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

interface OwnProps {
  cardId: string;
  actions: Array<{
    type: string;
    handler: (content?: string) => void;
    icon: string;
    label: string;
  }>;
  content: string;
  itemTitle: string;
}

export default function Note({
  actions,
  cardId,
  content,
  itemTitle,
}: OwnProps): ReactElement {
  const [input, setInput] = useState(
    content || `Create a note for ${itemTitle}…`,
  );
  const [inputError, setInputError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.currentTarget.value;
    setInput(value);

    // Clear error when user starts typing
    if (inputError) setInputError("");
  };

  const handleAction = (action: any) => {
    if (action.type === "discard") {
      setInput("");
      setInputError("");
      action.handler();
      return;
    }

    // Validate note content before submitting
    const noteValidation = InputValidator.validateNoteContent(input);
    if (!noteValidation.isValid) {
      setInputError("Note content must be between 1 and 1000 characters");
      return;
    }

    // Clear error and submit with sanitized content
    setInputError("");
    action.handler(noteValidation.sanitized);
  };

  return (
    <div className="Note">
      <textarea
        className={`NoteContent ${inputError ? "error" : ""}`}
        onChange={handleInputChange}
        value={input}
        onClick={!content ? () => setInput("") : undefined}
        maxLength={1000} // Prevent extremely long notes
        placeholder={`Create a note for ${itemTitle}…`}
      />
      {inputError && <span className="error-message">{inputError}</span>}

      <div className="NoteControls">
        {actions.map((action, i) => (
          <button
            key={action.type}
            className={`BaseButton${i === 0 ? " button--outline" : ""}`}
            type="button"
            onClick={() => handleAction(action)}
          >
            <MaterialIcon icon={action.icon} /> {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
