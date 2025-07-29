/* ---------------------------------
CardControls
--------------------------------- */

import React from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

interface CardControlsProps {
  handlers: [() => void | Promise<void>, () => void | Promise<void>];
  icons: [string, string];
  labels: [string, string];
  type: string;
}

export default function CardControls({
  handlers,
  icons,
  labels,
  type,
}: CardControlsProps): React.ReactElement {
  const [primaryActionLabel, secondaryActionLabel] = labels;
  const [primaryActionIcon, secondaryActionIcon] = icons;
  const [primaryActionHandler, secondaryActionHandler] = handlers;

  return (
    <>
      <button
        key={"btnSecondaryLeft"}
        className="CardControlsButton"
        type="button"
        onClick={secondaryActionHandler}
      >
        {secondaryActionLabel} <MaterialIcon icon={secondaryActionIcon} />
      </button>

      <button
        key={"btnPrimaryRight"}
        className="CardControlsButton"
        type="button"
        onClick={primaryActionHandler}
      >
        {primaryActionLabel} <MaterialIcon icon={primaryActionIcon} />
      </button>
    </>
  );
}
