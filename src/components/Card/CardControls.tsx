/* ---------------------------------
CardControls
--------------------------------- */

import React, {
  ReactElement,
  ReactNodeArray,
  ReactFragment,
  ReactNode,
} from "react";
import MaterialIcon from "../Misc/MaterialIcon";

// TODO
interface OwnProps {
  handlers;
  icons;
  labels;
  type;
}

export default function CardControls({
  handlers,
  icons,
  labels,
  type,
}: // TODO any
OwnProps): any {
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
