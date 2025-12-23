# Design Guidelines: Website Webview Wrapper Mobile App

## Architecture Decisions

### Authentication
**No Authentication Required**
- This is a single-domain website wrapper with no native login
- Authentication is handled within the webview by the website itself
- No native profile/settings screen needed - website handles all user preferences

### Navigation Architecture
**Stack-Only Navigation**
- Single-screen app with stack navigation for modals/overlays
- Main screen: Full-screen webview displaying the website
- Modal screens: Error states, permission requests, deep link handlers

### Screen Specifications

#### Main Webview Screen
**Purpose**: Display the website in a native webview container with seamless navigation

**Layout**:
- Header: None (use website's native navigation)
- Status Bar: Translucent overlay, auto light/dark mode following device settings
- Main Content: Full-screen WebView component (edge-to-edge)
- Safe Area Insets:
  - Top: 0 (webview handles its own safe areas)
  - Bottom: 0 (webview handles its own safe areas)
  - Respect system insets for floating elements only

**Components**:
- WebView with pull-to-refresh gesture
- Loading indicator (centered spinner) shown during initial page load
- Floating retry button (bottom center) on network errors
- Progress bar (top edge) for page navigation/loading states

#### Splash Screen
**Purpose**: Display while app initializes and website loads

**Layout**:
- Full-screen background matching website brand
- Centered app icon or logo
- No text or loading indicators (native splash should be instant)
- Light/Dark mode variants that follow device settings

**Specifications**:
- Background: Solid color or subtle gradient (not busy)
- Image: App icon at 200x200dp, centered
- Duration: Hide automatically when DOMContentLoaded fires

#### Error State Screen
**Purpose**: Handle network failures and webview errors gracefully

**Layout**:
- Centered error icon (system warning icon, 64x64dp)
- Error message text (Typography.body, center-aligned)
- Retry button (primary action button, centered)
- Safe Area Insets: all sides insets + Spacing.xl

**Components**:
- Error icon with subtle animation (fade-in)
- Message: "Unable to load. Check your connection."
- Button: "Retry" with loading state

## Design System

### Color Palette
**Theme Colors** (match Median.co branding):
- Primary/Accent: User-defined from Median.co config (used for loading indicators, pull-to-refresh spinner)
- Background: Transparent (webview shows website colors)
- Error State Background: #FFFFFF (light mode), #000000 (dark mode)
- Status Bar: Translucent, auto-adjusts text color based on content

### Typography
**Minimal Native Text** (only for error states):
- Error Title: System font, 18sp, Medium weight
- Error Body: System font, 16sp, Regular weight
- Button Text: System font, 16sp, Semibold weight

### Visual Design
- **System Icons Only**: Use Android Material icons for retry/error states
- **No Custom Assets Needed**: Website provides all content and branding
- **Loading States**: Use Material Design circular progress indicator in primary color
- **Pull-to-Refresh**: Native Android refresh indicator in primary color

### Interaction Design
- **WebView Navigation**: Allow standard web navigation (back/forward via device back button)
- **Pull-to-Refresh**: Enabled by default, reloads the webview
- **External Links**: Open in-app by default unless they match deep link patterns
- **Haptic Feedback**: Subtle vibration on errors or failed navigation
- **Touchable Feedback**: Native Android ripple effect on retry button
  - Ripple color: primary color at 20% opacity

### Deep Linking
**Visual Feedback**:
- When deep link is intercepted, show brief loading state (100ms max)
- Seamlessly navigate to target URL in webview
- No visible transition - should feel instant

### Push Notifications
**Notification Badge**: Use app icon without modifications
**Notification Style**: System default, matches Android notification design guidelines
**Tap Behavior**: Opens app and navigates webview to notification deep link

### Accessibility
- **Screen Reader**: WebView content must be accessible (website responsibility)
- **Touch Targets**: Retry button minimum 48x48dp
- **Contrast**: Error text maintains 4.5:1 contrast ratio
- **Focus Indicators**: System default focus styles on native elements

### System UI Customization
- **Status Bar**: Translucent overlay, auto light/dark text
- **Navigation Bar** (Android): Match website theme or transparent
- **Orientation**: Support both portrait and landscape
- **Notch/Cutout Handling**: Webview respects device safe areas