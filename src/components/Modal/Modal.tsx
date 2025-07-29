"use client";

import React, { useEffect } from "react";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";
import { useAppStore } from "@/store";

export default function Modal() {
  const { modal, hideModal } = useAppStore();

  useEffect(() => {
    if (modal.visible) {
      // Prevent body scroll when Modal is visible
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [modal.visible]);

  return modal.visible ? (
    <section className="Modal">
      <div className="ModalControls">
        <button type="button" className="ModalCloseButton" onClick={hideModal}>
          <MaterialIcon icon="close" />
        </button>
      </div>

      <div className="ModalContainer">{modal.content}</div>
    </section>
  ) : null;
}
