import { notification } from "antd";
import React from "react";

type NotificationType = "success" | "info" | "warning" | "error";

export default function MeniNotification(
  title: string,
  message: string = "",
  severity: NotificationType = "info",
) {
  notification[severity]({
    message: title,
    description: message,
  });
  return <>{}</>;
}
