/* ---------------------------------
Modal
--------------------------------- */

import React from "react";
import MaterialIcon from "../Misc/MaterialIcon";
import { useDispatch, useSelector } from "react-redux";
import { toggleModal } from "../../redux/actions";
import { RootState } from "../../store";

export default function Modal() {
  const { open, content } = useSelector((state: RootState) => state.modal);
  const dispatch = useDispatch();

  return open ? (
    <section className="Modal">
      <div className="ModalControls">
        <button
          type="button"
          className="ModalCloseButton"
          onClick={() => dispatch(toggleModal())}
        >
          <MaterialIcon icon="close" />
        </button>
      </div>

      <div className="ModalContainer">{content}</div>
    </section>
  ) : null;
}
