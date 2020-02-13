/* ---------------------------------
NotificationMessage
--------------------------------- */

import React, { useEffect, useRef } from "react";

export default function NotificationMessage({
  message,
  icon,
  isVisible,
  timeOut
}) {
  return (
    <div className={`NotificationMessage ${isVisible ? "isVisible" : ""}`}>
      <div className="NotificationMessageVisual">{icon}</div>

      <div className="NotificationMessageContent">{message}</div>
    </div>
  );
}
