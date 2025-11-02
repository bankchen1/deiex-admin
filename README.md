# DEIEX Admin Vue

A comprehensive cryptocurrency exchange administration system built with Vue 3, TypeScript, and Vite.

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript 5.x (strict mode)
- **Build Tool**: Vite 5.x
- **State Management**: Pinia 2.x
- **Routing**: Vue Router 4.x
- **UI Library**: Ant Design Vue 4.x
- **HTTP Client**: Axios 1.x
- **Charts**: Apache ECharts 5.x
- **Date Handling**: Day.js

## Project Setup

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
# Development build
npm run build

# Staging build
npm run build:staging

# Production build
npm run build:production
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Project Structure

```
src/
├── layouts/          # Layout components
├── router/           # Route configuration
├── pages/            # Page components
├── sections/         # Business logic sections
├── widgets/          # Reusable widgets
├── forms/            # Form components
├── tables/           # Table components
├── modals/           # Modal and drawer components
├── shared/           # Shared components
├── stores/           # Pinia stores
├── services/         # API services
├── utils/            # Utility functions
├── types/            # TypeScript types
└── assets/           # Static assets
```

## Environment Variables

Create `.env.development`, `.env.staging`, and `.env.production` files with:

- `VITE_APP_ENV`: Environment name
- `VITE_API_BASE_URL`: API base URL
- `VITE_WS_BASE_URL`: WebSocket base URL
- `VITE_APP_TITLE`: Application title

## Development Guidelines

- Use TypeScript strict mode
- Follow Vue 3 Composition API with `<script setup>`
- Use Pinia for state management
- Follow the layered architecture pattern
- Write meaningful commit messages
- Run linting before committing (enforced by Husky)

## License

Proprietary
