# Mock Login - Development Mode

## Overview

The login page has been configured with mock authentication for development purposes. This allows you to access the dashboard without a real backend API.

## How to Use

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173` (or the port shown in terminal)

3. You will see the login page with pre-filled credentials:
   - **Username**: `admin` (can be changed to any value)
   - **Password**: `admin123` (can be changed to any value)

4. Click the "Login (Mock)" button

5. You will be redirected to the dashboard with full admin permissions

## Mock User Details

The mock login creates a user with the following properties:

```typescript
{
  id: '1',
  username: 'admin', // or whatever you entered
  email: 'admin@deiex.com',
  roles: ['admin', 'super_admin'],
  permissions: ['*'], // All permissions
  status: 'active',
  lastLoginAt: <current timestamp>
}
```

## Features

- **No Backend Required**: Works without any API server
- **Full Permissions**: Mock user has all permissions (`*`)
- **Session Persistence**: Auth data is stored in sessionStorage/localStorage
- **Auto-redirect**: Automatically redirects to dashboard after login

## Storage

The mock login stores data in:
- `sessionStorage.access_token`: Mock JWT token
- `localStorage.refresh_token`: Mock refresh token
- `localStorage.user`: Mock user data

## Logout

To logout and return to the login page:
1. Click the user menu in the top-right corner
2. Select "Logout"
3. Or clear browser storage manually

## Production

⚠️ **Important**: This mock login is for development only. In production:
- Replace with real authentication API calls
- Implement proper JWT token validation
- Add security measures (CSRF, rate limiting, etc.)
- Use HTTPS for all authentication requests

## Next Steps

Real authentication will be implemented in later tasks according to the project requirements:
- Task 1.2: Implement JWT-based authentication
- Task 22.1: Token refresh mechanism
- Task 22.2: Session timeout
- Task 21.1: Role-based access control

## Troubleshooting

### Can't access dashboard
- Check browser console for errors
- Clear browser storage and try again
- Verify the mock token is being set in sessionStorage

### Redirected back to login
- The auth guard checks for valid token
- Make sure sessionStorage has `access_token`
- Check that user data is in localStorage

### Permission errors
- Mock user should have `['*']` permissions
- Check authStore.permissions in Vue DevTools
- Verify RBAC guard is working correctly
