/* ---------------------------------
NotificationMessage
--------------------------------- */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotif } from "../../actions";

export default function NotificationMessage() {
  const dispatch = useDispatch();
  const { message, icon, isVisible, timeOut } = useSelector(
    state => state.notificationMessage
  );

  useEffect(() => {
    isVisible &&
      setTimeout(() => {
        dispatch(hideNotif());
      }, timeOut);
  }, [isVisible]);

  return isVisible ? (
    <div className={`NotificationMessage ${isVisible ? "isVisible" : ""}`}>
      <div className="NotificationMessageVisual">{icon}</div>

      <div className="NotificationMessageContent">{message}</div>
    </div>
  ) : null;
}
