import { Notifier, NotifierComponents } from "react-native-notifier";

type AlertTypes = "error" | "warn" | "info" | "success";

export const handleNotifier = (
  title: string,
  description: string,
  alertType: AlertTypes,
) => {
  Notifier.showNotification({
    Component: NotifierComponents.Alert,
    title,
    description,
    componentProps: {
      alertType,
    },
  });
};
