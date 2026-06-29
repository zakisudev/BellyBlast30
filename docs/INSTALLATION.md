# Installation Guide

## Requirements

- Node.js 20+
- npm 10+
- Expo CLI via npx
- Android Studio and/or Xcode for native builds

## Steps

1. Clone repository and change directory.
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npx expo start
```

4. Optional native run:

```bash
npm run android
npm run ios
```

## Notifications

- Android 13+ requires runtime POST_NOTIFICATIONS permission.
- iOS requires notification authorization dialog.
- Permissions can be triggered in Settings screen.
