"use client";

import React, { useEffect } from "react";
import { useAppStore } from "@/store";
import MaterialIcon from "@/components/MaterialIcon/MaterialIcon";

export default function NotificationMessage() {
  const { notification, hideNotification } = useAppStore();

  useEffect(() => {
    if (notification.visible) {
      const timer = setTimeout(() => {
        hideNotification();
      }, 4000); // Default timeout

      return () => clearTimeout(timer);
    }
  }, [notification.visible, hideNotification]);

  return notification.visible ? (
    <div
      className={`NotificationMessage isVisible ${
        notification.type === "success"
          ? "success"
          : notification.type === "error"
            ? "error"
            : "info"
      }`}
    >
      <div className="NotificationMessageVisual">
        <MaterialIcon
          icon={
            notification.type === "success"
              ? "check_circle"
              : notification.type === "error"
                ? "error"
                : "info"
          }
        />
      </div>

      <div className="NotificationMessageContent">{notification.message}</div>
    </div>
  ) : null;
}
