/* ---------------------------------
NotificationMessage
--------------------------------- */

import React, { useContext, useEffect } from "react";
import { StoreContext } from "../../App";
import { log } from "../../utils";

export default function NotificationMessage() {
  const [store, dispatch] = useContext(StoreContext);

  const { message, icon, isVisible, timeOut } = store.notificationMessage;

  useEffect(() => {
    isVisible &&
      setTimeout(() => {
        dispatch({ type: "HIDE_NOTIF" });
      }, timeOut);
  }, [isVisible]);

  return isVisible ? (
    <div className={`NotificationMessage ${isVisible ? "isVisible" : ""}`}>
      <div className="NotificationMessageVisual">{icon}</div>

      <div className="NotificationMessageContent">{message}</div>
    </div>
  ) : null;
}
