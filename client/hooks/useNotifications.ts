import { useEffect } from "react";
import * as Notifications from "expo-notifications";

export function useNotifications() {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        // Handle deep links from push notifications
        if (data?.url) {
          // The WebView will handle the URL navigation
          // You could store this in a context and access from WebViewScreen if needed
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
