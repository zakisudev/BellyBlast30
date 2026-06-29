# BellyBlast 30

BellyBlast 30 is a premium 30-day protocol tracker built with Expo and React Native.
It helps users complete daily fat-loss routine tasks, track hydration and body metrics, view trend analytics, and keep progress data exportable and recoverable.

## What Is New

- Upgraded to Expo SDK 56 with React 19 and React Native 0.85.
- Modernized all tab screens with adaptive light and dark styling.
- Redesigned bottom navigation with a contrast-opposed theme treatment:
  - Light bar in dark mode
  - Dark bar in light mode
  - Clear active and inactive icon contrast
- Refined home, progress, calendar, analytics, and settings visual hierarchy.
- Added richer settings cards for permissions, export, backup, and reset actions.
- Metric-first body measurements:
  - Weight in kg
  - Waist in cm
- Hydration controls and goals stored in ml with liters display formatting.
- Strengthened persisted state migrations for evolving settings and hydration data.

## Core Features

- 30-day protocol checklist with six daily tasks
- Daily progress and streak tracking
- Hydration progress with quick-add and custom input
- Measurements timeline and trend charts
- Calendar-based completion review
- Achievement system
- Notification setup and timezone-aware resync
- PDF summary export
- CSV measurement export
- JSON backup/share support

## Tech Stack

- Expo SDK 56
- React 19 + React Native 0.85
- TypeScript strict mode
- Expo Router
- React Native Paper (Material 3)
- Zustand with AsyncStorage persistence
- React Hook Form + Zod
- Reanimated + SVG chart rendering
- Expo platform services:
  - Notifications
  - Image Picker
  - File System
  - Sharing
  - Print
  - Media Library

## Step-By-Step Setup Guide

### 1. Prerequisites

Install these first:

- Node.js 20+
- npm 10+
- Git
- Expo tooling via npx (no global install required)
- For native builds:
  - Android Studio for Android
  - Xcode for iOS on macOS

### 2. Clone and Enter the Project

```bash
git clone <your-repo-url>
cd BellyBlast30
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run start
```

### 5. Run on a Device or Simulator

Choose one:

- Expo Go on physical device (scan QR)
- Android emulator
- iOS simulator (macOS only)
- Web preview

```bash
npm run android
npm run ios
npm run web
```

### 6. Validate Code Quality

Run these before commits:

```bash
npm run typecheck
npm run lint
```

Optional formatting pass:

```bash
npm run format
```

### 7. Configure Notifications

1. Open Settings tab.
2. Use the reminder permission card to grant notification access.
3. Allow permissions when prompted by the OS.
4. Keep timezone automatic in app settings for reliable reminder timing.

### 8. First Use Flow

1. Select theme preference (light, dark, or system).
2. Set daily hydration target.
3. Complete daily protocol tasks from Home.
4. Add hydration throughout the day.
5. Log measurements periodically.
6. Review trends in Progress and Analytics.
7. Use Calendar for completion review.
8. Export PDF or CSV when needed.
9. Create backups from Settings.

## Project Structure

- app
  - Route files and tab navigation via Expo Router
- components
  - Reusable UI primitives, cards, charts, forms, and progress widgets
- hooks
  - View-model hooks that bind screens to state and services
- services
  - Notifications, analytics, validation, exports, backup, and repositories
- store
  - Zustand persisted slices with migration support
- constants, data, types, utils, theme
  - Domain models, protocol constants, mock data, shared helpers, and design tokens

## Scripts

- npm run start
- npm run android
- npm run ios
- npm run web
- npm run typecheck
- npm run lint
- npm run lint:fix
- npm run format

## Troubleshooting

### Metro or startup issues

- Stop running Expo processes, then restart:

```bash
npm run start
```

- If cache-related issues appear:

```bash
npx expo start -c
```

### Notification behavior in Expo Go

- If reminders do not trigger as expected, configure permissions again in Settings.
- Native notification behavior can vary between Expo Go and development builds.

### Dependency mismatch after upgrades

Use Expo-managed install to align package versions:

```bash
npx expo install <package-name>
```

## Documentation

- docs/INSTALLATION.md
- docs/DEVELOPMENT.md
- docs/ARCHITECTURE.md
