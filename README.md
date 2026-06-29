# BellyBlast30

A 30-day belly blast workout mobile application built with React Native and Expo. This app provides guided fitness routines designed to target core muscles and help users achieve their fitness goals over a 30-day period.

## Features

- **30-Day Workout Program**: Progressive workout plans designed to strengthen core muscles
- **Cross-Platform Support**: Run on iOS, Android, and Web
- **TypeScript**: Type-safe development with TypeScript
- **Expo**: Fast development and easy deployment using Expo

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Expo CLI** (optional, but recommended) - Install globally with: `npm install -g expo-cli`

For **iOS development**:
- macOS with Xcode installed (or Xcode Command Line Tools)

For **Android development**:
- Android Studio with Android SDK configured

## Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd BellyBlast30
```

### Step 2: Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### Step 3: Verify Installation

Ensure all dependencies are installed correctly:
```bash
npm list
```

## Usage

### Starting the Development Server

Start the Expo development server:

```bash
npm start
```

This will open the Expo DevTools where you can choose your platform.

### Running on Different Platforms

#### Web (Browser)
```bash
npm run web
```

The app will open in your default browser at `http://localhost:19006`

#### iOS (macOS only)
```bash
npm run ios
```

This will build and launch the app in the iOS Simulator. Make sure Xcode is installed.

#### Android
```bash
npm run android
```

This will build and launch the app on a connected Android device or Android emulator.

### Using Expo Go (Mobile Preview)

For the quickest way to preview your app on a real device:

1. Install the **Expo Go** app on your iOS or Android device
2. Run `npm start`
3. Scan the QR code displayed in the terminal with your device's camera
4. The app will open in Expo Go

## Project Structure

```
BellyBlast30/
├── App.tsx              # Main app component
├── index.ts             # Entry point
├── app.json             # Expo configuration
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── assets/              # Images, icons, splash screens
│   ├── icon.png
│   ├── splash-icon.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── README.md            # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run ios` | Build and run on iOS Simulator |
| `npm run android` | Build and run on Android Emulator/Device |
| `npm run web` | Run in web browser |

## Development

### Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Package Manager**: npm/yarn
- **Styling**: React Native StyleSheet

### Making Changes

1. Edit files in the project (e.g., `App.tsx`)
2. Changes will automatically reload when you save
3. Use the Expo DevTools to debug and view errors

### Building for Production

To create a production build, use Expo's build service:

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

For detailed information, visit the [Expo Build Documentation](https://docs.expo.dev/versions/v54.0.0/build/setup/).

## Troubleshooting

### "Command not found: expo"
Install Expo CLI globally:
```bash
npm install -g expo-cli
```

### "Port 19000 is already in use"
Kill the process using the port or use a different port:
```bash
npm start -- --port 19001
```

### "No devices available"
- **iOS**: Ensure Xcode is installed and simulator is running
- **Android**: Check that Android emulator is running or device is connected via USB
- **Web**: Make sure port 19006 is available

### App not loading after changes
Try clearing the Expo cache:
```bash
npm start -- --clear
```

## Resources

- [Expo Documentation](https://docs.expo.dev/versions/v54.0.0/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

This project is private. Do not distribute without permission.

## Support

For issues or questions, please open an issue in the repository or contact the project maintainer.

---

**Happy coding! 💪**
