/* ---------------------------------
CardControls
--------------------------------- */

import React from "react";

export default function CardControls({
  handlers,
  icons,
  labels,
  type,
  //
}) {
  const [primaryActionLabel, secondaryActionLabel] = labels;
  const [primaryActionIcon, secondaryActionIcon] = icons;
  const [primaryActionHanlder, secondaryActionHanlder] = handlers;

  return [
    <button
      key={"btnSecondaryLeft"}
      className="CardControlsButton"
      type="button"
      onClick={secondaryActionHanlder}
    >
      {secondaryActionLabel}{" "}
      <i className="material-icons">{secondaryActionIcon}</i>
    </button>,

    <button
      key={"btnPrimaryRight"}
      className="CardControlsButton"
      type="button"
      onClick={primaryActionHanlder}
    >
      {primaryActionLabel} <i className="material-icons">{primaryActionIcon}</i>
    </button>,
  ];
}
