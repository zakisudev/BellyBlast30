# Architecture Documentation

## Overview

BellyBlast 30 follows a feature-first, MVVM-inspired architecture:

- Presentation: route screens and reusable components
- Business logic: hooks and analytics/measurement services
- Storage: Zustand + AsyncStorage persistence
- Platform integrations: Expo notifications, media, file services

## Layers

1. UI Layer

- app/(tabs) screens and route layout
- components for cards, forms, charts, progress widgets

2. ViewModel Layer

- hooks/* compose store state + service methods
- screens consume hooks, avoid direct storage side effects

3. Domain + Service Layer

- constants/protocol.ts defines six daily tasks
- services/* encapsulate notification scheduling, export, validation, analytics

4. Data Layer

- store/* holds persistent state slices
- types/models.ts provides strict contracts

## Key Design Decisions

- Strict TypeScript across all modules
- Small reusable components over monolithic screens
- Typed service result objects for safe error handling
- Expo Router for scalable file-based navigation
- Material 3 with custom premium color tokens
