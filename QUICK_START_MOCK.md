# Quick Start - Mock Mode

## 🎭 What is Mock Mode?

Mock mode allows you to run the entire admin panel **without any backend**. All API calls return realistic mock data instantly.

## 🚀 Getting Started

### 1. Start the Application

```bash
npm install
npm run dev
```

Mock mode is **enabled by default** in development.

### 2. Login

Open http://localhost:5173 and login with **any credentials**:

```
Username: admin
Password: 123456

OR

Username: anything
Password: whatever
```

**All credentials work in mock mode!**

### 3. Verify Mock Mode

Check the browser console for:
```
🎭 MOCK MODE ACTIVE
Mock mode is active. All API calls return mock data.
```

You'll also see an info alert on the login page.

## 📊 Available Mock Data

### Users
- 50 mock users with various roles
- Paginated lists
- User details and profiles

### KYC Records
- 30 mock KYC submissions
- Different statuses: pending, approved, rejected
- Document information

### Orders
- 100 mock orders (spot, futures)
- Various symbols: BTCUSDT, ETHUSDT, BNBUSDT
- Different statuses and types

### Assets
- 5 mock cryptocurrencies
- Balance information
- Deposit/withdrawal data

### Dashboard
- Statistics and metrics
- Recent activity feed
- Charts data

### Risk Management
- Risk scores and alerts
- Suspicious activity patterns
- Compliance data

## 🔧 Configuration

### Enable Mock Mode

```bash
# .env.development or .env.local
VITE_USE_MOCK=true
```

### Disable Mock Mode (Use Real API)

```bash
# .env.local
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://your-backend-url/api
```

Then restart the dev server:
```bash
npm run dev
```

## 🐛 Troubleshooting

### Browser Extension Errors

If you see errors like:
```
SecurityError: Failed to read 'origin' from 'Location'
Blocked a frame with origin "https://apps.rokt.com"
```

**These are harmless!** They come from browser extensions (crypto wallets, etc.) and don't affect the app.

**Solutions:**
- Ignore them (they don't break anything)
- Use incognito mode
- Disable browser extensions
- Filter console to hide "inpage.js" errors

### Mock Mode Not Working?

1. **Check console** - Look for "🎭 MOCK MODE ACTIVE"
2. **Restart server** - After changing `.env` files
3. **Clear cache** - Browser cache and localStorage
4. **Check .env** - Verify `VITE_USE_MOCK=true`

### Can't Login?

1. **Any credentials work** - Try "admin" / "admin"
2. **Check console** - Look for errors
3. **Clear storage** - sessionStorage and localStorage
4. **Refresh page** - Hard refresh (Ctrl+Shift+R)

## 📝 Development Tips

### Network Tab

In mock mode, you'll see:
- Requests are made to the API
- They're intercepted by the mock service
- Responses come back instantly with mock data
- Console logs show: `[Mock Service] GET /api/users`

### Adding Test Data

Edit mock service modules in `src/services/mock/modules/`:
- `auth.ts` - Add more users
- `users.ts` - Modify user data
- `orders.ts` - Add more orders
- etc.

### Switching Between Modes

Create `.env.local` to override settings:

```bash
# Use mock mode
VITE_USE_MOCK=true

# Use real API
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:3000/api
```

## 🎯 Common Scenarios

### Scenario 1: Pure Frontend Development

```bash
# Keep mock mode enabled (default)
npm run dev

# Login with any credentials
# All features work with mock data
```

### Scenario 2: Backend Integration Testing

```bash
# Create .env.local
echo "VITE_USE_MOCK=false" > .env.local
echo "VITE_API_BASE_URL=http://localhost:3000/api" >> .env.local

# Restart server
npm run dev

# Now connects to real backend
```

### Scenario 3: Demo/Presentation

```bash
# Mock mode is perfect for demos
npm run dev

# Login with "admin" / "admin"
# Show all features with consistent data
# No backend setup required
```

## 📚 More Information

- Full documentation: `src/services/mock/README.md`
- Implementation details: `MOCK_MODE_IMPLEMENTATION.md`
- API client code: `src/services/api/AdminApiClient.ts`
- Mock service: `src/services/mock/index.ts`

## ✅ Checklist

- [x] Mock mode enabled by default
- [x] Login with any credentials
- [x] All API endpoints mocked
- [x] Realistic data with pagination
- [x] Network delay simulation
- [x] Console indicators
- [x] Easy to disable for real API
- [x] No backend required
- [x] Works offline
- [x] Demo ready

## 🎉 You're Ready!

Just run `npm run dev` and start developing. Everything works out of the box with mock data!
