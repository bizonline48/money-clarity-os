# Money Clarity OS

Track Money Clearly. Decide Calmly.

A privacy-first personal finance Progressive Web App (PWA) built for SK Empire.

## Tech Stack

- **React 18** with TypeScript (strict mode)
- **Vite** for blazing fast builds
- **Tailwind CSS** for styling with custom design tokens
- **Dexie.js** for IndexedDB storage
- **Decimal.js** for precise money calculations
- **Zustand** for state management
- **Vitest** for testing

## Getting Started

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
npm run build
```

### Test

```bash
npm test
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── app/              # App root and providers
├── features/         # Feature modules
├── design-system/    # Design tokens and components
├── db/               # Dexie database and repositories
├── services/         # Business logic services
├── store/            # Zustand stores
├── types/            # TypeScript interfaces
└── lib/              # Utilities and constants
```

## Phase 1 Complete ✓

- [x] Scaffold project with Vite + React + TypeScript
- [x] Install all dependencies
- [x] Configure Tailwind with design tokens
- [x] Set up Dexie schema + migrations
- [x] Build repository layer (one class per entity)
- [x] Build money.ts service (Decimal.js wrapper)
- [x] Build health-score.ts service
- [x] Set up Zustand stores
- [x] Write unit tests for money.ts and health-score.ts

All tests passing: 34/34 ✓

## Brand

**Owner:** Suzannah Khoo, SK Empire, Singapore  
**Personality:** Trustworthy, professional, calm, intelligent, modern, transparent

## Privacy First

All financial data stays on your device. No server calls. No tracking. Full user control.
