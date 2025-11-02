# Security Enhancements Implementation

This document describes the security enhancements implemented for the DEIEX Admin Vue application.

## Overview

Three major security features have been implemented:
1. Token refresh mechanism with expiration checking
2. Session timeout with inactivity tracking
3. Sensitive data masking with permission-based reveal

## 1. Token Refresh Mechanism

### Implementation Details

**Files Modified:**
- `admin-vue/src/services/api/AdminApiClient.ts`
- `admin-vue/src/stores/auth.ts`

**Features:**
- Automatic token expiration checking before each API request
- Proactive token refresh 5 minutes before expiration
- Token expiration time stored in sessionStorage
- Seamless token refresh without user interruption
- Automatic logout on refresh failure with redirect to login

**How It Works:**
1. When user logs in, the token expiration time is calculated and stored
2. Before each API request, the client checks if the token is expiring soon (within 5 minutes)
3. If expiring, the client automatically refreshes the token in the background
4. If refresh fails, the user is logged out and redirected to login page
5. Failed requests are queued during refresh and retried after successful refresh

**Configuration:**
- Default token lifetime: 15 minutes (configurable via API response)
- Refresh threshold: 5 minutes before expiration
- Refresh token lifetime: 7 days (stored in localStorage)

## 2. Session Timeout

### Implementation Details

**Files Created:**
- `admin-vue/src/composables/useSessionTimeout.ts`

**Files Modified:**
- `admin-vue/src/layouts/AdminShell.vue`
- `admin-vue/src/composables/index.ts`

**Features:**
- Automatic logout after 30 minutes of inactivity
- Activity tracking for mouse, keyboard, scroll, touch, and click events
- Warning modal shown 2 minutes before auto logout
- User can extend session by clicking "Stay Logged In"
- Session state persists across page refreshes
- Automatic cleanup on logout

**How It Works:**
1. Session timeout tracking starts when user logs in
2. User activity events reset the inactivity timer
3. After 28 minutes of inactivity, a warning modal appears
4. User has 2 minutes to click "Stay Logged In" or be logged out
5. On auto logout, user is redirected to login with session timeout message

**Configuration:**
- Inactivity timeout: 30 minutes
- Warning before logout: 2 minutes
- Tracked events: mousedown, keydown, scroll, touchstart, click

## 3. Sensitive Data Masking

### Implementation Details

**Files Created:**
- `admin-vue/src/composables/useSensitiveData.ts`
- `admin-vue/src/shared/SensitiveDataToggle.vue`

**Files Modified:**
- `admin-vue/src/tables/users/UserTable.vue`
- `admin-vue/src/sections/users/UserOverviewSection.vue`
- `admin-vue/src/shared/index.ts`
- `admin-vue/src/composables/index.ts`

**Existing Utilities Used:**
- `admin-vue/src/utils/format.ts` (formatEmailMasked, formatPhoneMasked)

**Features:**
- Email masking: Shows first 2-3 characters + "***" + domain
- Phone masking: Shows first 3 digits + "****" + last 4 digits
- Permission-based reveal toggle
- Toggle button only visible to authorized users
- Masking state managed per component instance
- Applied to user tables and detail views

**How It Works:**
1. By default, sensitive data (emails, phone numbers) are masked
2. Users with appropriate permissions see a "Show/Hide Sensitive Data" toggle button
3. Clicking the toggle reveals or masks the data
4. Masking state is local to each component (not persisted)
5. Only users with specific permissions can reveal data

**Required Permissions:**
- `users.view_sensitive`
- `users.view_full`
- `admin.full_access`

**Masking Examples:**
- Email: `john.doe@example.com` → `jo***@example.com`
- Phone: `+1234567890` → `+12****7890`

## Security Best Practices

### Token Management
- Access tokens stored in sessionStorage (cleared on browser close)
- Refresh tokens stored in localStorage (persistent)
- Token expiration time stored in sessionStorage
- All tokens cleared on logout
- Automatic cleanup on authentication failure

### Session Management
- Activity tracking prevents unauthorized access
- Warning modal gives users time to respond
- Session state cleared on logout
- No session data persists after logout

### Data Protection
- Sensitive data masked by default
- Permission checks before revealing data
- Masking applied consistently across all views
- No sensitive data in logs or error messages

## Testing Recommendations

### Token Refresh Testing
1. Login and wait for token to expire (or mock expiration)
2. Verify automatic refresh occurs
3. Verify failed requests are retried after refresh
4. Verify logout on refresh failure

### Session Timeout Testing
1. Login and remain inactive for 28 minutes
2. Verify warning modal appears
3. Click "Stay Logged In" and verify session continues
4. Remain inactive for 2 more minutes and verify auto logout

### Data Masking Testing
1. Login with user without sensitive data permissions
2. Verify toggle button is not visible
3. Login with user with permissions
4. Verify toggle button is visible
5. Click toggle and verify data is revealed/masked

## Future Enhancements

### Potential Improvements
1. Configurable timeout durations per user role
2. Session timeout warning countdown timer
3. Multiple session management (force logout from other devices)
4. Audit logging for sensitive data reveals
5. Configurable masking patterns per data type
6. Biometric authentication for sensitive data reveal
7. Time-limited data reveal (auto-mask after X seconds)

## Troubleshooting

### Token Refresh Issues
- Check browser console for refresh errors
- Verify refresh token is present in localStorage
- Check API endpoint is responding correctly
- Verify token expiration time is set correctly

### Session Timeout Issues
- Check if activity events are being tracked
- Verify timers are being reset on activity
- Check modal is appearing at correct time
- Verify logout is occurring after timeout

### Data Masking Issues
- Check user permissions in auth store
- Verify masking functions are imported correctly
- Check toggle button visibility logic
- Verify masking state is being updated

## Related Requirements

This implementation satisfies the following requirements from the design document:

- **Requirement 21.1**: RBAC permission checks
- **Requirement 21.2**: Permission-based UI rendering
- **Requirement 21.4**: Sensitive data masking
- **Requirement 21.5**: Session timeout and auto logout
- **Requirement 22.1**: Token expiration checking
- **Requirement 22.2**: Automatic token refresh
- **Requirement 22.3**: Token refresh failure handling
- **Requirement 22.4**: Request ID tracking
- **Requirement 22.5**: Error code mapping
- **Requirement 22.6**: Automatic error notifications

## Conclusion

These security enhancements significantly improve the security posture of the DEIEX Admin application by:
- Preventing unauthorized access through automatic session management
- Protecting sensitive user data through masking
- Ensuring seamless user experience through automatic token refresh
- Providing clear feedback through warning modals and notifications
