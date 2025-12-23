import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WebViewScreen from "@/screens/WebViewScreen";
import { HeaderTitle } from "@/components/HeaderTitle";

export type RootStackParamList = {
  WebView: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: () => <HeaderTitle title="Trip Planner KSA" />,
        headerTransparent: true,
        headerBlurEffect: "prominent",
      }}
    >
      <Stack.Screen
        name="WebView"
        component={WebViewScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
