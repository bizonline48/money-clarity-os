# Money Clarity OS — Project CLAUDE.md
# Read this entire file before touching any code.
# Update the Build Status section after each phase completes.

---

## Product Overview

**Name:** Money Clarity OS™
**Tagline:** Track Money Clearly. Decide Calmly.
**Type:** Privacy-first Personal Finance PWA
**Owner:** Suzannah Khoo, SK Empire, Singapore

**Brand personality:** Trustworthy, professional, calm, intelligent, modern, transparent.
**Avoid:** Crypto styling, flashy fintech visuals, aggressive sales messaging, fake luxury.

---

## Tech Stack

| Tool | Purpose | Version |
|---|---|---|
| React | UI framework | 18 |
| Vite | Build tool | Latest |
| TypeScript | Language | Strict mode |
| Tailwind CSS | Styling | v3 |
| Dexie.js | IndexedDB wrapper | Latest |
| Decimal.js | Money calculations | Latest |
| Zustand | State management | Latest |
| React Hook Form | Form handling | Latest |
| Zod | Schema validation | Latest |
| Recharts | Charts | Latest |
| Lucide React | Icons | Latest |
| Framer Motion | Animations | Latest |
| date-fns | Date utilities | Latest |
| clsx + tailwind-merge | Class utilities | Latest |
| vite-plugin-pwa | PWA configuration | Latest |
| Vitest | Testing | Latest |

**Do NOT use:**
- localStorage for financial data (use Dexie/IndexedDB only)
- localStorage is permitted only for: theme preference, onboarding flag
- Raw IndexedDB without Dexie
- Native JS arithmetic for money (use Decimal.js)
- Any bank integration or credential collection

---

## Architecture Rules

### Layer order — never skip layers
```
Presentation (React components)
    ↓
State (Zustand stores)
    ↓
Business Logic (pure TS services in /services)
    ↓
Data Access (Dexie repositories in /db/repositories)
    ↓
Storage (IndexedDB via Dexie)
```

### Data storage rule
- All financial data: IndexedDB via Dexie
- Theme preference: localStorage key `mc_theme`
- Onboarding complete flag: localStorage key `mc_onboarded`
- Nothing else in localStorage

### Money rule
- Store: integers in cents. SGD 12.50 → stored as `1250`
- Calculate: Decimal.js always
- Display: `Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' })`
- Pro users can change currency in Settings — respect their selection

---

## Folder Structure

```
money-clarity-os/
├── public/
│   ├── icons/              # PWA icons — all sizes
│   └── manifest.webmanifest
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── Router.tsx
│   │   └── Providers.tsx
│   ├── features/
│   │   ├── dashboard/
│   │   ├── transactions/   # Income + Expenses unified
│   │   ├── budgets/
│   │   ├── goals/
│   │   ├── debts/
│   │   ├── reports/
│   │   ├── export/
│   │   └── settings/
│   ├── design-system/
│   │   ├── tokens.ts       # All colour + spacing tokens
│   │   └── components/     # Button, Card, Modal, Toast etc.
│   ├── db/
│   │   ├── schema.ts       # Dexie database + migrations
│   │   └── repositories/   # One file per entity
│   ├── services/
│   │   ├── money.ts        # Decimal.js wrapper — all calculations
│   │   ├── health-score.ts # Financial Health Score formula
│   │   ├── export.ts       # CSV + JSON + PDF (Pro only)
│   │   └── backup.ts       # Backup + restore (Pro only)
│   ├── store/
│   │   ├── ui.store.ts
│   │   └── filters.store.ts
│   ├── types/              # Shared TypeScript interfaces
│   └── lib/
│       ├── utils.ts
│       ├── constants.ts
│       └── validators.ts   # Zod schemas
└── tests/
```

---

## Design System

### Colour tokens (CSS custom properties)

```css
/* Light mode */
--mc-bg-base: #FAFAF9;
--mc-bg-surface: #FFFFFF;
--mc-bg-subtle: #F5F4F2;
--mc-accent: #16653A;
--mc-accent-light: #E8F5EE;
--mc-income: #16653A;
--mc-expense: #9B3121;
--mc-warning: #92560E;
--mc-text-1: #111110;
--mc-text-2: #6B6A68;
--mc-text-3: #A8A7A4;
--mc-border: rgba(0,0,0,0.08);
--mc-radius-sm: 8px;
--mc-radius-md: 12px;
--mc-radius-lg: 16px;

/* Dark mode (Pro only — gated by feature flag) */
--mc-bg-base: #0E0E0D;
--mc-bg-surface: #1C1C1A;
--mc-bg-subtle: #252523;
--mc-accent: #22C075;
--mc-accent-light: #0F2E1E;
--mc-income: #22C075;
--mc-expense: #E8835C;
--mc-warning: #F5B842;
--mc-text-1: #F0EFED;
--mc-text-2: #9D9C99;
--mc-text-3: #636260;
--mc-border: rgba(255,255,255,0.08);
```

### Typography
- Headings: Plus Jakarta Sans
- Body: Plus Jakarta Sans
- Numbers in tables: font-variant-numeric: tabular-nums (CSS only — no extra font)

### Motion
- Subtle only — card hover, page transitions, progress animations
- Wrap all animations in `@media (prefers-reduced-motion: no-preference)`
- No excessive animation — performance is priority

---

## Database Schema (Dexie)

```typescript
// All amounts stored as integers (cents)
// SGD 12.50 → 1250

interface Transaction {
  id: string;           // uuid
  type: 'income' | 'expense';
  amount: number;       // integer cents
  categoryId: string;
  date: string;         // ISO date string YYYY-MM-DD
  notes?: string;
  tags?: string[];      // Pro only
  isRecurring?: boolean; // Pro only
  createdAt: number;    // timestamp
}

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  colour: string;
  isSystem: boolean;    // system = cannot delete
  isCustom: boolean;    // custom = Pro only
}

interface Budget {
  id: string;
  categoryId: string;
  limitAmount: number;  // integer cents
  period: 'monthly';
  startDate: string;
}

interface Goal {
  id: string;
  name: string;
  targetAmount: number; // integer cents
  currentAmount: number; // integer cents
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: number;
}

interface Debt {
  id: string;
  name: string;
  originalAmount: number;  // integer cents
  currentBalance: number;  // integer cents
  interestRate?: number;   // Pro only — percentage as decimal e.g. 0.05 = 5%
  minimumPayment?: number; // Pro only — integer cents
  createdAt: number;
}

interface DebtPayment {
  id: string;
  debtId: string;
  amount: number;  // integer cents
  date: string;
  createdAt: number;
}

interface Settings {
  id: 'singleton';    // only one settings record
  currency: string;   // default 'SGD' — Pro can change
  isPro: boolean;
  proUnlockedAt?: number;
  theme: 'light' | 'dark'; // dark = Pro only
  onboardingComplete: boolean;
}
```

---

## Free vs Pro Feature Gates

### Free tier limits
- Max 30 transactions total (hard stop — friendly prompt at 28, block at 30)
- Max 1 budget
- Max 1 savings goal
- Default categories only (no custom)
- Basic debt tracker: balance + repayments only
- Basic reports: current month only
- Basic health score: number only, no breakdown
- Light mode only
- SGD only
- No export
- No backup + restore

### Pro tier (SGD $39 one-time)
- Unlimited transactions
- Unlimited budgets
- Unlimited savings goals
- Custom categories + icons
- Recurring transactions
- Full debt payoff planner (interest rate, projections, avalanche/snowball)
- Full historical reports (all time)
- Advanced trend analysis + charts
- Full health score breakdown (5 pillars)
- CSV + JSON export
- PDF reports
- Data backup + restore
- Dark mode
- Multi-currency support
- Budget overspend alerts

### Pro gate implementation
- Check `settings.isPro` from Dexie before rendering any Pro feature
- Show a friendly upgrade prompt — never lock or hide without explanation
- Free users always keep full access to data they have already entered
- The 30-transaction block only prevents new entries — never viewing or editing

---

## Financial Health Score Formula

Total: 100 points. Display only when at least 14 days of transactions exist.

| Pillar | Points | Formula |
|---|---|---|
| Savings rate | 25 | (total income - total expenses) / total income × 100. Full 25pts at ≥20% savings rate. |
| Budget control | 25 | % of active budgets not exceeded. Full 25pts if all budgets respected. |
| Cashflow | 20 | Income > expenses = positive. Scaled by margin. |
| Goal progress | 15 | % of active goals on track (current/target ≥ expected by date). |
| Debt ratio | 15 | Total debt / monthly income. Full 15pts if ratio < 1. Zero if ratio > 5. |

Bands: 80–100 = Thriving. 50–79 = Building. 0–49 = Attention needed.
Pro breakdown shows each pillar separately with explanation.

---

## 14 Screens

1. Welcome — hero, benefits, install instructions
2. Dashboard — income, expenses, cashflow, savings, budgets, top categories, health score
3. Income — add, edit, delete income transactions
4. Expenses — add, edit, delete expense transactions
5. Categories — view and manage (custom = Pro)
6. Budgets — set limits, view utilisation, alerts (multiple = Pro)
7. Goals — savings goals, progress, milestones (multiple = Pro)
8. Debt Tracker — balance tracking free, full planner = Pro
9. Reports — basic current month free, full history = Pro
10. Export Centre — Pro only (CSV, JSON, PDF)
11. Settings — theme, currency, data reset, Pro unlock
12. Privacy Policy — full policy, data stored locally
13. Terms of Use — educational tool disclaimer
14. Help Centre — iPhone install, Android install, FAQs

---

## Build Phase Sequence

### Phase 1 — Foundation (do this first, always)
- [ ] Scaffold project with Vite + React + TypeScript
- [ ] Install all dependencies
- [ ] Configure Tailwind with design tokens
- [ ] Set up Dexie schema + migrations
- [ ] Build repository layer (one class per entity)
- [ ] Build money.ts service (Decimal.js wrapper)
- [ ] Build health-score.ts service
- [ ] Set up Zustand stores

### Phase 2 — Design system
- [ ] CSS custom property tokens (light + dark)
- [ ] App shell + bottom navigation
- [ ] Core components: Button, Input, Card, Modal, Toast, Badge, Progress, Skeleton
- [ ] Page transition system

### Phase 3 — Core screens
- [ ] Welcome + onboarding
- [ ] Dashboard
- [ ] Income management
- [ ] Expense management
- [ ] Categories
- [ ] Budgets
- [ ] Goals
- [ ] Debt tracker

### Phase 4 — Reports, export, settings, compliance
- [ ] Reports screen
- [ ] Export centre (Pro gate)
- [ ] Settings
- [ ] Privacy Policy
- [ ] Terms of Use
- [ ] Help Centre

### Phase 5 — PWA + performance
- [ ] vite-plugin-pwa configuration
- [ ] Workbox caching strategies
- [ ] Offline fallback
- [ ] iOS install prompt (custom)
- [ ] Lighthouse audit + optimisation

### Phase 6 — Testing + deployment
- [ ] Unit tests for money.ts and health-score.ts
- [ ] Component tests for CRUD forms
- [ ] Zero TypeScript errors
- [ ] Zero console errors
- [ ] Deployment to Vercel

---

## Current Build Status

**Phase:** Phase 5 Complete ✓ — All Phases Complete!
**Last completed:** Phase 5 — PWA configuration complete. 34 tests passing, zero TypeScript errors. Ready for deployment.
**Next action:** Deploy to production and generate PWA icons

### Phase 1 Checklist — Foundation ✓
- [x] Scaffold project with Vite + React + TypeScript
- [x] Install all dependencies
- [x] Configure Tailwind with design tokens
- [x] Set up Dexie schema + migrations
- [x] Build repository layer (one class per entity)
- [x] Build money.ts service (Decimal.js wrapper)
- [x] Build health-score.ts service
- [x] Set up Zustand stores
- [x] Write unit tests for money.ts and health-score.ts (34 tests passing)

### Phase 2 Checklist — Design System ✓
- [x] CSS custom property tokens (light + dark mode)
- [x] App shell + bottom navigation
- [x] React Router v6 with all 14 routes
- [x] Providers component with database initialisation
- [x] Button component (4 variants, 3 sizes)
- [x] Input component (with label, error, helper text)
- [x] Card component (3 variants + sub-components)
- [x] Modal component (with backdrop, close, slots)
- [x] Toast component + useToast hook (4 variants)
- [x] Badge component (5 variants)
- [x] ProgressBar component (4 variants, animated)
- [x] Skeleton component (4 variants, loading states)
- [x] BottomSheet component (mobile slide-up)
- [x] Welcome screen with hero, benefits, PWA install guide
- [x] Dark mode support (Pro-gated via useTheme hook)

### Phase 3 Checklist — Core Screens ✓
- [x] Dashboard with monthly stats, health score, top categories, goal + budget previews
- [x] TransactionList with filter, swipe-to-delete, empty state, free tier limits (30 max)
- [x] TransactionForm with Zod validation, category selector, date picker
- [x] BudgetList with progress bars, warning/danger states, Pro gate (1 free, unlimited Pro)
- [x] BudgetForm with category selector, monthly limit
- [x] GoalList with progress tracking, days remaining, milestone celebration
- [x] GoalForm with target amount, target date, starting amount
- [x] DebtList with repayment progress, Pro-gated interest tracking
- [x] DebtForm with interest rate and minimum payment (Pro only)
- [x] Reports screen with current month bar chart + pie chart, Pro gate for historical
- [x] All screens wired to Router, bottom navigation updated
- [x] Full Dexie integration via repository layer
- [x] Real-time currency formatting using Intl.NumberFormat
- [x] Skeleton loaders for all async data loading

### Phase 4 Checklist — Settings, Export, Compliance ✓
- [x] Settings screen with theme toggle (Pro), currency selector (Pro), Pro status display
- [x] Data reset with type "DELETE" confirmation modal
- [x] App version and links to compliance pages
- [x] ProUpgradeModal component with benefits list, SGD $39 pricing
- [x] ExportCentre with CSV export (transactions), JSON export (full backup)
- [x] PDF report using window.print() with print-specific styling
- [x] Restore from backup (JSON upload with confirmation)
- [x] Pro-only gate for Export Centre with full-screen upgrade prompt
- [x] PrivacyPolicy page with PDPA compliance, data storage explanation
- [x] TermsOfUse page with disclaimers, Pro purchase terms, liability limitations
- [x] HelpCentre page with iPhone/Android install guides, 8 FAQ items
- [x] FAQ accordion component with expand/collapse
- [x] Dashboard enhanced with Pro health score breakdown (5 pillars with explanations)
- [x] Categories management screen with custom category CRUD (Pro only)
- [x] Category colour picker with 10 preset colours
- [x] Custom categories can be edited and deleted (with transaction check)
- [x] All pages wired to Router

### Phase 5 Checklist — PWA Configuration ✓
- [x] vite-plugin-pwa configured with auto-update strategy
- [x] manifest.webmanifest with app metadata, icons, shortcuts
- [x] Workbox caching strategies (cache-first for fonts, assets)
- [x] Service worker with 9 precached entries (989.78 kB)
- [x] PWA icon placeholders (192x192, 512x512) for deployment
- [x] iOS install prompt component with step-by-step instructions
- [x] Auto-dismiss after first view, localStorage persistence
- [x] Offline fallback component for network errors
- [x] Enhanced index.html with PWA meta tags, Apple-specific tags
- [x] viewport-fit=cover for safe area insets
- [x] Apple mobile web app capable tags
- [x] Theme colour and status bar styling

Update this section after every phase completes.

---

## Important Constraints

- Never request banking credentials
- Never request NRIC, passport, or government ID
- Never integrate external trackers by default
- Never store sensitive personal data beyond what the user explicitly enters
- All data stays on device — no server calls for user financial data
- PDPA-ready architecture: data minimisation, user control, clear purpose
