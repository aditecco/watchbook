/* ---------------------------------
CardControls
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";

export default function CardControls({
  handlers,
  icons,
  labels,
  type,
  //
}) {
  const [primaryActionLabel, secondaryActionLabel] = labels;
  const [primaryActionIcon, secondaryActionIcon] = icons;
  const [primaryActionHandler, secondaryActionHandler] = handlers;

  return [
    <button
      key={"btnSecondaryLeft"}
      className="CardControlsButton"
      type="button"
      onClick={secondaryActionHandler}
    >
      {secondaryActionLabel} <MaterialIcon icon={secondaryActionIcon} />
    </button>,

    <button
      key={"btnPrimaryRight"}
      className="CardControlsButton"
      type="button"
      onClick={primaryActionHandler}
    >
      {primaryActionLabel}
      <MaterialIcon icon={primaryActionIcon} />
    </button>,
  ];
}
