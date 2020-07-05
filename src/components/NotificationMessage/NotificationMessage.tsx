/* ---------------------------------
NotificationMessage
--------------------------------- */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideNotif } from "../../redux/actions";
import MaterialIcon from "../Misc/MaterialIcon";
import { RootState } from "../../store";

export default function NotificationMessage() {
  const dispatch = useDispatch();
  const { message, icon, isVisible, timeOut, theme } = useSelector(
    (state: RootState) => state.notificationMessage
  );

  useEffect(() => {
    isVisible &&
      setTimeout(() => {
        dispatch(hideNotif());
      }, timeOut);
  }, [isVisible]);

  return isVisible ? (
    <div
      className={`NotificationMessage ${isVisible ? "isVisible" : ""} ${
        theme === "light" ? "light" : ""
      }`}
    >
      {icon && (
        <div className="NotificationMessageVisual">
          <MaterialIcon icon={icon} />
        </div>
      )}

      <div className="NotificationMessageContent">{message}</div>
    </div>
  ) : null;
}
