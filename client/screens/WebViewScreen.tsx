import React, { useState, useRef } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  Pressable,
} from "react-native";
import WebView, { type WebViewNavigation } from "react-native-webview";
import { useTheme } from "@/hooks/useTheme";
import { Colors, Spacing, Typography } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface WebViewState {
  isLoading: boolean;
  error: string | null;
  canGoBack: boolean;
}

const WEBSITE_URL = "https://stable-jade-vqfivy7b1o.edgeone.dev/";

export default function WebViewScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);

  const [state, setState] = useState<WebViewState>({
    isLoading: true,
    error: null,
    canGoBack: false,
  });

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
