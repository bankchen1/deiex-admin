# Quick Start Guide

## Getting Started with DEIEX Admin

This guide will help you get the admin dashboard running in development mode.

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

```bash
# Install dependencies
npm install
```

## Development

```bash
# Start development server
npm run dev
```

The app will open at `http://localhost:5173` (or another port if 5173 is busy).

## First Login

1. You'll see the login page automatically
2. Default credentials are pre-filled:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login (Mock)" button
4. You'll be redirected to the dashboard

**Note**: This is a mock login - any username/password will work!

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Build for staging
npm run build:staging

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
admin-vue/
├── src/
│   ├── pages/          # Page components
│   │   ├── auth/       # Login page
│   │   ├── dashboard/  # Dashboard
│   │   ├── users/      # User management
│   │   ├── kyc/        # KYC management
│   │   └── ...
│   ├── layouts/        # Layout components
│   ├── components/     # Reusable components
│   ├── stores/         # Pinia stores
│   ├── router/         # Vue Router config
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript types
├── public/             # Static assets
└── ...
```

## Key Features

### Mock Authentication
- No backend required for development
- Full admin permissions
- Session persistence

### Performance Optimizations
- Lazy loading for routes and heavy components
- Virtual scrolling for large tables
- API response caching
- Optimized bundle splitting

### Internationalization
- English and Chinese support
- Easy to add more languages
- Locale switching in UI

### Security Features
- Session timeout (mock)
- Sensitive data masking
- Role-based access control (RBAC)

## Navigation

After login, you can access:

- **Dashboard** - Overview and metrics
- **KYC** - KYC verification management
- **Users** - User management
- **Assets** - Deposits and withdrawals
- **Orders** - Spot and futures orders
- **Config** - System configuration
  - Instruments
  - Margin
  - Fees
  - Calendar
  - Icons
  - Mappings
  - Security
- **Risk** - Risk management
- **Ops** - Operations and logs
- **Reports** - Analytics and reports
- **Settings** - System settings

## Development Tips

### Hot Module Replacement (HMR)
Changes to Vue files will hot-reload automatically without losing state.

### Vue DevTools
Install Vue DevTools browser extension for debugging:
- Inspect component hierarchy
- View Pinia store state
- Track router navigation
- Monitor performance

### TypeScript
The project uses TypeScript for type safety. Check types with:
```bash
npm run build
```

### Code Quality
Format and lint before committing:
```bash
npm run format
npm run lint
```

## Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically try another port.

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Login Issues
Clear browser storage:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage
4. Refresh page

### Performance Issues
Check browser console for errors and warnings.

## Documentation

- `MOCK_LOGIN.md` - Mock login details
- `LOGIN_IMPLEMENTATION.md` - Login implementation summary
- `PERFORMANCE_OPTIMIZATION.md` - Performance features
- `ROUTER_IMPLEMENTATION.md` - Router configuration
- `SERVERTABLE_IMPLEMENTATION.md` - Server table usage
- Various `*_IMPLEMENTATION.md` files for specific features

## Next Steps

1. Explore the dashboard
2. Check out different pages
3. Review the code structure
4. Read feature documentation
5. Start building!

## Support

For issues or questions:
1. Check existing documentation
2. Review code comments
3. Check browser console for errors
4. Clear cache and try again

## Production Build

To build for production:

```bash
npm run build:production
```

Output will be in `dist/` directory.

**Note**: Remember to replace mock authentication with real API calls before deploying to production!

## Environment Variables

Create `.env` files for different environments:

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000
VITE_ENV=development

# .env.production
VITE_API_BASE_URL=https://api.deiex.com
VITE_ENV=production
```

## Happy Coding! 🚀
