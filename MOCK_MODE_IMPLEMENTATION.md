# Mock Mode Implementation

## Overview

Implemented a comprehensive mock service system that intercepts all API calls and returns mock data. This allows the application to run completely offline without any backend dependencies.

## Changes Made

### 1. Mock Service Architecture

Created a modular mock service system in `src/services/mock/`:

```
src/services/mock/
├── index.ts              # Main mock service with interceptor
├── README.md             # Documentation
└── modules/
    ├── auth.ts           # Authentication mocks
    ├── users.ts          # User management mocks
    ├── kyc.ts            # KYC mocks
    ├── assets.ts         # Asset mocks
    ├── orders.ts         # Order mocks
    ├── dashboard.ts      # Dashboard mocks
    └── risk.ts           # Risk management mocks
```

### 2. Environment Configuration

Added `VITE_USE_MOCK` to all environment files:

- `.env.development` - Mock enabled (true)
- `.env.local` - Mock enabled (true)
- `.env.staging` - Mock disabled (false)
- `.env.production` - Mock disabled (false)

### 3. API Client Integration

Updated `src/services/api/AdminApiClient.ts` to:
- Import and initialize mock service
- Enable mock mode based on environment variable
- Setup axios interceptor for mock responses

### 4. Login Page Enhancement

Completely rewrote `src/pages/auth/Login.vue`:
- Professional login form with username/password fields
- Accepts **any credentials** in mock mode
- Visual indicator showing mock mode status
- Proper error handling and loading states
- Responsive design with gradient background

### 5. Mock Mode Middleware

Created `src/middleware/mock.ts`:
- Utility functions to check mock mode status
- Console logging with visual indicators
- Integrated into `src/main.ts` for app initialization

## Features

### Authentication in Mock Mode

- **Login with any credentials** - username and password are not validated
- Always returns admin user with full permissions
- Generates mock tokens that persist in session
- Session restoration works normally

### Mock Data Characteristics

- **Realistic data** - Users, orders, KYC records, etc.
- **Pagination support** - Handles page/pageSize parameters
- **Network simulation** - Random delays (200-700ms)
- **Consistent responses** - Same data across requests
- **All CRUD operations** - GET, POST, PUT, PATCH, DELETE

### Visual Indicators

When mock mode is active:
```
🎭 MOCK MODE ACTIVE
Mock mode is active. All API calls return mock data.
```

On login page:
- Info alert showing "Mock Mode Active"
- Message: "You can login with any username and password"

## Cross-Origin Errors (rokt.com)

### Issue Analysis

The errors you're seeing:
```
SecurityError: Failed to read a named property 'origin' from 'Location': 
Blocked a frame with origin "https://apps.rokt.com"
```

**These are NOT from your application code.** They are caused by:

1. **Browser Extension** - Most likely a crypto wallet extension (MetaMask, Coinbase Wallet, etc.)
2. **Third-party scripts** - Extensions inject scripts that try to access cross-origin frames
3. **CSP violations** - The extension's scripts violate Content Security Policy

### Solution

These errors are **harmless** and can be safely ignored. They don't affect your application functionality.

To hide them:
1. **Disable browser extensions** during development
2. **Use incognito mode** without extensions
3. **Filter console** - Hide "inpage.js" and "injected.js" errors
4. **Ignore them** - They don't impact your app

### Verification

The application code is clean:
- ✅ No external scripts in `index.html`
- ✅ No rokt.com references in codebase
- ✅ Clean `main.ts` initialization
- ✅ Proper CSP configuration

## Pages Structure

### No Duplication Found

Verified the pages structure - there is **no duplication**:

```
src/pages/
├── auth/
│   └── Login.vue          # Single login page
├── dashboard/
│   └── index.vue          # Single dashboard
├── users/
│   ├── List.vue
│   └── Detail.vue
├── kyc/
│   ├── index.vue
│   └── Detail.vue
└── [other modules...]
```

All router modules correctly import from `@/pages/` with no conflicts.

## Usage

### Development with Mock Mode

```bash
# Start dev server (mock mode enabled by default)
npm run dev

# Login with any credentials
Username: admin
Password: anything

# All API calls return mock data
```

### Development with Real API

```bash
# Create .env.local
echo "VITE_USE_MOCK=false" > .env.local

# Start dev server
npm run dev

# Now connects to real backend
```

### Testing Mock Service

```bash
# Open browser console
# Look for: 🎭 MOCK MODE ACTIVE

# Login and check network tab
# All requests are intercepted and return mock data
```

## Adding New Mock Endpoints

See `src/services/mock/README.md` for detailed instructions on:
- Creating new mock service modules
- Registering endpoints
- Handling different HTTP methods
- Returning realistic data

## Benefits

1. **Offline Development** - No backend required
2. **Fast Iteration** - Instant responses, no network delays
3. **Consistent Testing** - Same data every time
4. **Demo Ready** - Works anywhere without setup
5. **Easy Onboarding** - New developers can start immediately

## Next Steps

To extend mock functionality:

1. Add more mock data to existing modules
2. Create new mock service modules for additional endpoints
3. Add more realistic data variations
4. Implement mock WebSocket support (if needed)
5. Add mock file upload/download handlers

## Troubleshooting

### Mock mode not working?

1. Check environment variable: `console.log(import.meta.env.VITE_USE_MOCK)`
2. Restart dev server after changing `.env` files
3. Clear browser cache and localStorage
4. Check console for "🎭 MOCK MODE ACTIVE" message

### Still seeing API errors?

1. Verify mock service is imported in `AdminApiClient.ts`
2. Check axios interceptor is setup correctly
3. Look for console logs: "[Mock Service] GET /api/..."
4. Ensure endpoint is handled in mock service modules

### Login not working?

1. Check mock auth service is registered
2. Verify `/auth/login` endpoint is handled
3. Check browser console for errors
4. Try clearing sessionStorage and localStorage
