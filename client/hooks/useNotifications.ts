import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const navigation = useNavigation();

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
  }, [navigation]);
}
