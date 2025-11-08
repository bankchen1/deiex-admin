# Mock Service

The mock service intercepts all API calls and returns mock data when enabled. This is useful for:

- Frontend development without a backend
- Testing UI components
- Demos and presentations
- Offline development

## Configuration

Mock mode is controlled by the `VITE_USE_MOCK` environment variable:

```bash
# Enable mock mode (default for development)
VITE_USE_MOCK=true

# Disable mock mode (use real API)
VITE_USE_MOCK=false
```

## Environment Files

- `.env.development` - Mock mode enabled by default
- `.env.local` - Mock mode enabled by default
- `.env.staging` - Mock mode disabled
- `.env.production` - Mock mode disabled

## Features

### Authentication
- Login with **any username and password**
- All users are authenticated as admin with full permissions
- Tokens are generated but not validated
- Session persistence works normally

### API Endpoints
All API endpoints return realistic mock data:

- `/auth/*` - Authentication endpoints
- `/users` - User management
- `/kyc` - KYC records
- `/assets` - Asset management
- `/orders` - Order management
- `/dashboard` - Dashboard statistics
- `/risk` - Risk management

### Data Characteristics
- Paginated responses with realistic page sizes
- Random delays (200-700ms) to simulate network latency
- Consistent data across requests
- Realistic data structures matching API contracts

## Adding New Mock Endpoints

1. Create a new service module in `src/services/mock/modules/`:

```typescript
// src/services/mock/modules/myservice.ts
import type { MockResponse } from '../index'

class MockMyService {
  handle(url: string, method: string, data?: unknown): MockResponse | null {
    if (url.includes('/myendpoint') && method === 'get') {
      return {
        data: {
          success: true,
          data: { /* your mock data */ },
          message: 'Success',
        },
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
      }
    }
    return null
  }
}

export const mockMyService = new MockMyService()
```

2. Register it in `src/services/mock/index.ts`:

```typescript
import { mockMyService } from './modules/myservice'

// In getMockResponse method:
if (url.includes('/myendpoint')) {
  return mockMyService.handle(url, method, config.data)
}
```

## Debugging

When mock mode is active, you'll see:
- Console message: "🎭 MOCK MODE ACTIVE"
- Each API call logged: "[Mock Service] GET /api/users"
- Mock mode indicator on login page

## Switching Modes

To switch between mock and live mode:

1. Update the environment variable in your `.env` file
2. Restart the dev server: `npm run dev`

Or create a `.env.local` file to override:

```bash
# .env.local
VITE_USE_MOCK=false
```
