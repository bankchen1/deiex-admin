# DEIEX Admin Dashboard - Development Context

## Project Overview

DEIEX Admin is a comprehensive cryptocurrency exchange administration system built with Vue 3, TypeScript, and Vite. It serves as the backend management interface for a cryptocurrency exchange platform, providing administrators with tools to manage users, KYC processes, assets, orders, configurations, risk management, operations, reports, and settings.

### Key Features
- **Dashboard**: Overview and metrics
- **KYC Management**: KYC verification management
- **User Management**: User accounts and permissions
- **Asset Management**: Deposits and withdrawals
- **Order Management**: Spot and futures orders
- **System Configuration**: Instruments, margin, fees, calendar, icons, mappings, security
- **Risk Management**: Risk controls and monitoring
- **Operations**: Logs and system operations
- **Reports**: Analytics and reporting
- **Settings**: System settings and configurations

### Technology Stack
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript 5.x (strict mode)
- **Build Tool**: Vite 5.x
- **State Management**: Pinia 2.x
- **Routing**: Vue Router 4.x
- **UI Library**: Ant Design Vue 4.x
- **HTTP Client**: Axios 1.x
- **Charts**: Apache ECharts 5.x
- **Date Handling**: Day.js
- **Internationalization**: Vue I18n
- **Linting**: ESLint + Prettier

## Project Structure
```
/Volumes/BankChen/deiex1/deiex-admin/
├── .env.development          # Development environment variables
├── .env.production           # Production environment variables
├── .env.staging             # Staging environment variables
├── public/                  # Static assets
├── scripts/                 # Build and utility scripts
├── src/
│   ├── api/                 # API client configuration
│   ├── assets/              # Static assets (images, styles)
│   ├── components/          # Reusable Vue components
│   ├── composables/         # Vue composables
│   ├── forms/               # Form components
│   ├── generated/           # Generated code files
│   ├── i18n/                # Internationalization files
│   ├── layouts/             # Layout components
│   ├── middleware/          # Middleware functions
│   ├── modals/              # Modal and drawer components
│   ├── pages/               # Page components
│   ├── router/              # Route configuration
│   ├── sections/            # Business logic sections
│   ├── services/            # API service wrappers
│   ├── shared/              # Shared components
│   ├── stores/              # Pinia stores (state management)
│   ├── tables/              # Table components
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── widgets/             # Widget components
│   ├── App.vue              # Main application component
│   └── main.ts              # Application entry point
├── tests/                   # Test files
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite build configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev                 # Start development server
npm run preview             # Preview production build
```

### Build
```bash
npm run build               # Development build
npm run build:staging       # Staging build
npm run build:production    # Production build
```

### Code Quality
```bash
npm run lint                # Run ESLint and fix issues
npm run format              # Format code with Prettier
```

## Key Development Patterns

### State Management
- Uses Pinia for state management with multiple stores for different domains (auth, users, kyc, assets, orders, etc.)
- Stores are organized in `src/stores/` with each domain having its own store file

### Routing
- Uses Vue Router with modular route configuration
- Routes are organized in `src/router/modules/` by feature
- Implements route guards for authentication and authorization (RBAC)

### Component Organization
- Layouts in `src/layouts/`
- Pages in `src/pages/` (organized by feature)
- Reusable components in `src/components/`, `src/shared/`, `src/forms/`, `src/tables/`, `src/modals/`, `src/widgets/`
- Uses Ant Design Vue for UI components

### Internationalization
- Supports English and Chinese languages
- Located in `src/i18n/`
- Easy to add additional languages

### Mock Mode
- The application includes mock authentication for development
- Mock services are implemented to allow development without a backend
- Many implementation files mention mock mode features

### Environment Configuration
- Uses `.env` files for different environments
- Supports development, staging, and production configurations
- Environment variables include API base URLs and WebSocket URLs

### Development Conventions
- TypeScript strict mode with no unused variables/parameters
- Composition API with `<script setup>` syntax
- Vue 3 best practices
- ESLint and Prettier for code quality and formatting
- Commit hooks with Husky to enforce code quality

## Important Files and Documentation

The project contains several implementation documentation files (in the root directory) that detail various features:
- `ADMIN_PANEL_ENHANCEMENTS_SUMMARY.md` - Summary of admin panel enhancements
- `AGENTS.md` - Agent implementation details
- `CALENDAR_IMPLEMENTATION.md` - Calendar feature implementation
- `COPY_TRADING_IMPLEMENTATION.md` - Copy trading feature implementation
- `FACADE_IMPLEMENTATION.md` - Facade pattern implementation
- `FEES_IMPLEMENTATION.md` - Fees management implementation
- And many more feature-specific documentation files

## Special Considerations

- The current implementation uses mock authentication and mock services for development
- In production, authentication and API calls would connect to real backend services
- Several implementation files indicate that the application currently operates in mock mode
- The project supports comprehensive cryptocurrency exchange management features
- Internationalization is implemented with support for multiple languages
- The application includes performance optimizations like lazy loading and virtual scrolling