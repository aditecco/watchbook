/* ---------------------------------
Modal
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";

export default function Modal({ open, children, closeAction }) {
  return open ? (
    <section className="Modal">
      <div className="ModalControls">
        <button
          type="button"
          className="ModalCloseButton"
          onClick={closeAction}
        >
          <MaterialIcon icon="close" />
        </button>
      </div>

      <div className="ModalContainer">{children}</div>
    </section>
  ) : null;
}
