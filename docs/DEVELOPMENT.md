# Development Guide

## Scripts

- npm run start
- npm run android
- npm run ios
- npm run web
- npm run typecheck
- npm run lint
- npm run format

## Quality Workflow

1. Implement feature using reusable components.
2. Run `npm run typecheck`.
3. Run `npm run lint`.
4. Run `npm run format` if needed.

## State and Services

- Zustand stores handle user/session state.
- Services encapsulate side effects and async APIs.
- Hooks provide view-model abstractions for screens.

## Persistence

- AsyncStorage persistence is configured per store.
- Migration stubs are included in persist options.
