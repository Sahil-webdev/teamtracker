# Multi App Structure (User + Master)

## Goal
- Single backend (`backend/app.py`)
- Two separate Android apps:
  - `com.locationtracker.user` (User app)
  - `com.locationtracker.master` (Master app)
- No mixed panel UI in one app.

## How it is implemented
- Android product flavors in `android/app/build.gradle`:
  - `user` flavor
  - `master` flavor
- Flavor-specific values:
  - unique `applicationIdSuffix`
  - unique app name via `resValue`
  - `BuildConfig.APP_PANEL` set to `user` or `master`
- Native module (`PanelTypeModule`) exposes panel type to JS.
- `App.tsx` loads one navigator only:
  - `UserAppNavigator`
  - `MasterAppNavigator`

## JS structure
- `src/navigation/UserAppNavigator.tsx`
- `src/navigation/MasterAppNavigator.tsx`
- `src/config/panel.ts` reads native panel type

## Run commands
- User app:
  - `npm run android:user`
- Master app:
  - `npm run android:master`

## Existing launchers
- `run-user-panel.bat` now installs `userDebug`
- `run-master-panel.bat` now installs `masterDebug`

## Shared backend
- Both apps call same API base URL in `src/config/api.ts`
- Backend remains common and unchanged.
