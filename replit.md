# Trip Planner KSA - Website Webview Wrapper Mobile App

## Project Overview
A React Native mobile app built with Expo that wraps the Trip Planner KSA website in a webview with native features including push notifications, deep linking, and splash screen branding.

**Website URL**: https://stable-jade-vqfivy7b1o.edgeone.dev/

## Architecture

### Frontend (Expo/React Native)
- **Technology**: React Native with Expo SDK 54
- **Navigation**: Single-screen app with React Navigation 7
- **Webview**: react-native-webview for displaying the website
- **Push Notifications**: expo-notifications for handling push notifications
- **Styling**: Native React Native components with theme system

### Backend (Express.js)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **API**: REST endpoints for push notification token registration

### Database Schema
- `notification_tokens` table: Stores device-specific push notification tokens
  - `id`: UUID primary key
  - `deviceId`: Unique device identifier
  - `token`: Expo push notification token
  - `platform`: "ios" or "android"
  - `createdAt`, `updatedAt`: Timestamps

## File Structure

```
client/
├── App.tsx                          # Root app with error boundary
├── screens/
│   └── WebViewScreen.tsx           # Main webview wrapper with push notification setup
├── navigation/
│   └── RootStackNavigator.tsx       # Single-screen stack navigation
├── hooks/
│   ├── useTheme.ts                 # Theme hook
│   ├── useColorScheme.ts           # Color scheme detection
│   ├── useScreenOptions.ts         # Navigation options hook
│   └── useNotifications.ts         # Notification listener hook
├── components/
│   ├── HeaderTitle.tsx             # App header with icon and title
│   ├── ErrorBoundary.tsx           # Error boundary wrapper
│   ├── ErrorFallback.tsx           # Error fallback UI
│   ├── ThemedText.tsx              # Themed text component
│   ├── ThemedView.tsx              # Themed view component
│   ├── KeyboardAwareScrollViewCompat.tsx # Keyboard handling
│   ├── Button.tsx                  # Styled button
│   ├── Card.tsx                    # Card component
│   └── Spacer.tsx                  # Spacing utility
├── constants/
│   └── theme.ts                    # Design tokens (colors, spacing, typography)
└── lib/
    └── query-client.ts             # React Query configuration

server/
├── index.ts                        # Express server setup
├── routes.ts                       # API routes (push notification registration)
├── db.ts                           # Drizzle database client
└── storage.ts                      # Database storage class

shared/
└── schema.ts                       # Drizzle ORM schema definitions
```

## Key Features Implemented

✅ **Webview Integration**: Full-screen webview displaying the Trip Planner KSA website
✅ **Push Notifications**: Expo notifications setup with backend token registration
✅ **Splash Screen**: Custom splash screen with Trip Planner branding
✅ **App Icon**: Custom icon extracted from splash screen and configured for iOS/Android
✅ **Deep Linking**: Support for tripplannerksa:// scheme
✅ **Error Handling**: Network error states with retry functionality
✅ **Loading States**: Initial loading spinner while website loads
✅ **Navigation**: Header with app title and icon

## Design System

### Colors
- Primary (Accent): #007AFF (Apple Blue)
- Dark Teal: #2D5A5A (splash background)
- Forest Green: #1B6F4C (adaptive icon)
- Transparent webview showing website colors

### Typography
- Minimal native UI (webview handles most content)
- System fonts (SF Pro on iOS, Roboto on Android)

## API Endpoints

### POST /api/notifications/register
Registers a device's push notification token with the backend

**Request Body**:
```json
{
  "deviceId": "device-1766454123456",
  "token": "ExponentPushToken[...]",
  "platform": "android" | "ios"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "deviceId": "device-1766454123456",
    "token": "ExponentPushToken[...]",
    "platform": "android",
    "createdAt": "2025-12-23T01:52:00Z",
    "updatedAt": "2025-12-23T01:52:00Z"
  }
}
```

## Running the App

**Development**:
```bash
npm run server:dev    # Start Express backend
npm run expo:dev      # Start Expo dev server
```

**Testing**:
- Web: http://localhost:8081
- Physical device: Scan QR code with Expo Go
- Deep linking: tripplannerksa://

## Deployment Notes

- Bundle identifiers set to: `com.tripplannerksa.app`
- App slug: `trip-planner-ksa`
- Deep link scheme: `tripplannerksa://`
- Supports both portrait orientation (can be extended to landscape)

## Future Enhancements

- Offline caching for webview content
- JavaScript bridge for web-to-native communication
- Deep link analytics tracking
- Biometric authentication
- Advanced webview caching strategies
