import { notification } from "antd";
import React from "react";

type NotificationType = "success" | "info" | "warning" | "error";

export default function MeniNotification(
  title: string,
  message: string = "",
  severity: NotificationType = "info",
  duration: number = 4.5,
) {
  notification[severity]({
    message: title,
    description: message,
    duration: duration,
  });
  return <>{}</>;
}
