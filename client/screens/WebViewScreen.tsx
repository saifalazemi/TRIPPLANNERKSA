import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Pressable,
  Platform,
  AppState,
} from "react-native";
import WebView, { type WebViewNavigation } from "react-native-webview";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { apiRequest } from "@/lib/query-client";

interface WebViewState {
  isLoading: boolean;
  error: string | null;
  canGoBack: boolean;
}

const WEBSITE_URL = "https://tripplannerksa.com";

export default function WebViewScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);
  const appState = useRef(AppState.currentState);

  const [state, setState] = useState<WebViewState>({
    isLoading: true,
    error: null,
    canGoBack: false,
  });

  const [notificationToken, setNotificationToken] = useState<string | null>(
    null
  );

  // Initialize push notifications
  useEffect(() => {
    const registerPushNotifications = async () => {
      if (!Device.isDevice) {
        console.log("Must use physical device for push notifications");
        return;
      }

      try {
        // Request notification permission
        const { status } = await Notifications.getPermissionsAsync();
        let finalStatus = status;

        if (status !== "granted") {
          const { status: newStatus } =
            await Notifications.requestPermissionsAsync();
          finalStatus = newStatus;
        }

        if (finalStatus !== "granted") {
          console.log("Failed to get push notification permission");
          return;
        }

        // Get the push token
        const token = await Notifications.getExpoPushTokenAsync();
        setNotificationToken(token.data);

        // Send token to backend
        if (token.data) {
          try {
            const deviceId =
              Device.modelId ||
              Device.osBuildId ||
              `device-${Date.now()}`;
            const platform = Platform.OS === "ios" ? "ios" : "android";

            await apiRequest("POST", "/api/notifications/register", {
              deviceId,
              token: token.data,
              platform,
            });
          } catch (error) {
            console.error("Failed to register push token with backend:", error);
          }
        }
      } catch (error) {
        console.error("Failed to initialize push notifications:", error);
      }
    };

    registerPushNotifications();

    // Handle app state changes
    const subscription = AppState.addEventListener("change", (state) => {
      appState.current = state;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Handle navigation state changes
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setState((prev) => ({
      ...prev,
      canGoBack: navState.canGoBack,
    }));
  };

  const handleLoadStart = () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));
  };

  const handleLoadEnd = () => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
    }));
  };

  const handleError = () => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      error: "Unable to load website. Please check your connection.",
    }));
  };

  const handleRetry = () => {
    setState((prev) => ({
      ...prev,
      error: null,
      isLoading: true,
    }));
    webViewRef.current?.reload();
  };

  const handleGoBack = () => {
    if (state.canGoBack) {
      webViewRef.current?.goBack();
    }
  };

  if (state.error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.backgroundRoot }]}>
        <Text
          style={[
            styles.errorTitle,
            { color: theme.text },
          ]}
        >
          Connection Error
        </Text>
        <Text
          style={[
            styles.errorMessage,
            { color: theme.tabIconDefault },
          ]}
        >
          {state.error}
        </Text>
        <Pressable
          style={[
            styles.retryButton,
            { backgroundColor: Colors.light.link },
          ]}
          onPress={handleRetry}
        >
          <Text style={[styles.retryButtonText, { color: Colors.light.buttonText }]}>
            Try Again
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: WEBSITE_URL }}
        style={styles.webView}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loadingContainer, { backgroundColor: theme.backgroundRoot }]}>
            <ActivityIndicator size="large" color={Colors.light.link} />
          </View>
        )}
        allowsBackForwardNavigationGestures={true}
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
  },
  errorTitle: {
    ...Typography.h4,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  errorMessage: {
    ...Typography.body,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 24,
  },
  retryButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: 8,
    minWidth: 150,
  },
  retryButtonText: {
    ...Typography.body,
    fontWeight: "600",
    textAlign: "center",
  },
});
