# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

# HireMind Web — Codebase Guide for Claude

## Response Rules
- Always answer in 70 words or less.
- Prefer concise answers.
- No introductions or conclusions.
- Answer directly.

---

## Project Overview

**HireMind** is an AI-powered recruitment platform. This repo (`hiremind_web`) is the Next.js frontend. It serves two audiences:
- **Job Seekers (Candidates)** — find jobs, apply with AI assistance, track applications
- **Recruitment Companies** — source candidates, parse resumes in bulk, use AI matching

The full architecture document is in [`docs/architecture.md`](docs/architecture.md).

---

## Tech Stack

| Tool | Version | Notes |
|---|---|---|
| Next.js | 16.2.7 | App Router only — no Pages Router |
| React | 19.2.4 | Server Components by default |
| TypeScript | 5 | Strict mode enabled |
| Tailwind CSS | 4 | Custom design tokens in `app/globals.css` |
| Node | 20 LTS | Run inside devcontainer — no local Node needed |

**Not yet installed** (add when needed):
- `next-auth@beta` — session management
- `@tanstack/react-query` — server/cache state
- `zustand` — client/UI state
- `react-hook-form` + `zod` — forms and validation
- `axios` — API client
- `sonner` — toasts
- `@stomp/stompjs` — WebSocket notifications

---

## Development Setup

This project runs inside a **Dev Container** — no local Node/npm required.

```bash
# Inside the devcontainer:
npm install     # first time only
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # start production server
```

The `.devcontainer/` folder has `devcontainer.json` + `Dockerfile` (Node 20 / Debian Bookworm).

---

## Backend Services

| Service | Port | Context path | Source |
|---|---|---|---|
| users_api | **5001** | `/user-service` | `/Users/femilam/Project/backend/hiremind/users_api` |
| candidate_api | **5002** | `/candidate-service` | `/Users/femilam/Project/backend/hiremind/candidate_api` |

Both services are Spring Boot (Maven) apps running inside Docker containers with **host network mode**.
PostgreSQL runs on port 5432, Redis on port 6379.
Shared library: `/Users/femilam/Project/backend/hiremind/core_module` — `ApiResponse<T>` record and common utilities.

### Master Data Endpoints (candidate_api — public, no auth)
| Endpoint | Controller method | Source |
|---|---|---|
| `GET /master/degrees` | `getDegrees()` | `degree_courses` table (DB-backed) |
| `GET /master/education-types` | `getEducationTypes()` | `education_types` table (DB-backed) |
| `GET /master/employment-types` | `getEmploymentTypes()` | `EmploymentType` enum (no DB needed) |

All return `ApiResponse<List<{name}>>`. Employment types: `FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, REMOTE, HYBRID`.

### CORS — Next.js Proxy Rewrites
```
Browser → /api/users/*     → Next.js rewrite → host.docker.internal:5001/user-service/*
Browser → /api/candidate/* → Next.js rewrite → host.docker.internal:5002/candidate-service/*
```
Configured in `next.config.ts` using env vars from `.env.local`. Browser never hits backend directly.

> **DevContainer networking:** Use `host.docker.internal` — not `localhost` — in `.env.local`.

### Token Storage (pre-NextAuth)
All stored in `localStorage`. **Always use the helpers in `lib/api/config.ts`** — never call `localStorage` directly in services (no SSR guard).

| Key | Helper |
|---|---|
| `hiremind_access_token` | `getAccessToken()` / `setAccessToken()` |
| `hiremind_refresh_token` | `setRefreshToken()` |
| `hiremind_user_id` | `setUserId()` |
| `hiremind_user_name` | `getStoredUserName()` / `setStoredUserName()` |
| `hiremind_job_title` | `getStoredJobTitle()` / `setStoredJobTitle()` |

`clearAuth()` wipes all five keys. `hiremind_user_name` is written at registration and kept in sync by `fetchCandidateProfile()` — used for zero-latency name display before the API responds.

---

## Environment Variables

`.env.local` (gitignored — never commit):
```bash
USERS_API_URL=http://host.docker.internal:5001/user-service
CANDIDATE_API_URL=http://host.docker.internal:5002/candidate-service
NEXT_PUBLIC_DEFAULT_COUNTRY_CODE=+91   # optional — defaults to +91 in registerCandidateUser
```

**Do NOT** use `NEXT_PUBLIC_` prefix on service URLs — that bypasses the proxy and causes CORS errors.
**Restart `npm run dev`** after any change to `.env.local`.

---

## Folder Structure

```
hiremind_web/
├── app/
│   ├── (marketing)/            # Public marketing pages — Header + Footer layout
│   ├── (auth)/                 # Auth flow — each page owns its full layout
│   │   ├── error.tsx           # Route-level error boundary for auth pages
│   │   └── register/candidate/ # /register/candidate (4-step registration)
│   ├── (app)/                  # Authenticated app shell (with sidebar)
│   │   ├── error.tsx           # Route-level error boundary for dashboard
│   │   ├── layout.tsx          # Wraps ProfileProvider + AppHeader + AppSidebar
│   │   └── dashboard/page.tsx  # Thin wrapper → <DashboardPage />
│   ├── (app-wide)/             # Authenticated, full-width (no sidebar)
│   │   ├── error.tsx           # Route-level error boundary for profile
│   │   ├── layout.tsx          # AppHeader only — no ProfileProvider, no sidebar
│   │   └── profile/page.tsx    # Thin wrapper → <ProfilePage />
│   ├── layout.tsx              # Root layout (html, body, fonts only)
│   └── globals.css             # Tailwind v4 design tokens — do not rename tokens
│
├── components/
│   └── marketing/              # Shared marketing-only UI (Header, Footer, BrandLogo)
│
├── lib/
│   ├── utils.ts                # Shared utilities — toLabel() and future helpers
│   └── api/
│       └── config.ts           # API base URLs + all localStorage token/profile helpers
│
├── modules/
│   ├── auth/
│   │   ├── types/auth.types.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts       # registerCandidateUser(), loginUser(), deleteCurrentUser()
│   │   │   └── candidate.service.ts  # Profile, education, experience, skills, certifications, preferences APIs
│   │   └── components/
│   │       ├── AuthHeader.tsx         # Reusable auth header — h-[72px], BrandLogo size="md"
│   │       └── candidate-reg/         # 4-step registration components (see Auth Integration section)
│   │           └── shared/
│   │               ├── constants.ts   # EMPLOYMENT_TYPE_MAP, EMPLOYMENT_TYPES, etc.
│   │               ├── hooks.ts       # useConfirmDelete() — shared confirm-delete hook
│   │               ├── icons.tsx      # Shared SVG icon components
│   │               ├── types.ts       # ConfirmState, PreferencesData, ExperienceFormData, etc.
│   │               ├── ui.tsx         # ConfirmDialog, Tooltip, SelectField, etc.
│   │               └── validators.ts  # isValidEmail, isStrongPassword, isValidMMYYYY, isDateRangeValid
│   │
│   └── dashboard/
│       ├── DashboardPage.tsx          # "use client" orchestrator — stats, search bar, job tabs, right sidebar
│       ├── ProfilePage.tsx            # "use client" orchestrator — 3-column profile layout
│       ├── context/
│       │   └── ProfileContext.tsx     # Single profile fetch (useRef guard); shared via useProfile()
│       └── components/
│           ├── AppHeader.tsx          # "use client" — full-width h-[72px] header, greeting + logout dropdown
│           ├── AppSidebar.tsx         # "use client" — left nav, profile card, premium upsell
│           ├── StatCard.tsx           # Reusable stat tile
│           ├── JobCard.tsx            # Job listing card with match %, fake/ghost badges
│           ├── MatchInsightsPanel.tsx # Donut chart (conic-gradient) + legend side-by-side
│           ├── JobAlertsPanel.tsx     # "use client" — toggleable alerts
│           ├── CareerTipsPanel.tsx    # Static career tips list
│           └── profile/
│               ├── ProfileLeftPanel.tsx    # Back link, avatar, contact, strength ring, section nav
│               ├── ProfileOverviewCard.tsx # 8-field grid + match score donut with progress bars
│               └── ProfileRightPanel.tsx   # Highlights, key strengths, documents, need help
│
├── docs/
│   └── architecture.md
├── .env.local
├── .devcontainer/
└── next.config.ts              # Rewrites proxy + turbopack root
```

---

## Route Map

| URL | Page | Status |
|---|---|---|
| `/` | Marketing home | ✅ Built |
| `/features` | Features | ✅ Built |
| `/ai-capabilities` | AI capabilities | ✅ Built |
| `/pricing` | Pricing | ✅ Built |
| `/faq` | FAQ | ✅ Built |
| `/login` | Login with role selector | ✅ Built |
| `/signup` | Role selection (Candidate / Company) | ✅ Built |
| `/otp` | Email OTP verification | ✅ Built |
| `/register/candidate` | 4-step candidate registration | ✅ Built + API wired |
| `/dashboard` | Candidate dashboard | ✅ Built + API wired |
| `/profile` | Candidate profile overview | ✅ Built + API wired |
| `/jobs` | Job listings | ⏳ Pending |
| `/candidates` | Candidate search (recruiter) | ⏳ Pending |
| `/company` | Company profile | ⏳ Pending |
| `/recruiters` | Recruiter management | ⏳ Pending |
| `/settings` | Settings | ⏳ Pending |

---

## Architecture Rules

### Route groups
- `(marketing)` — public pages, uses `Header + Footer` layout
- `(auth)` — login/register flows, **each page owns its full-page layout**
- `(app)` — authenticated shell with sidebar — wraps `ProfileProvider` → `AppHeader` → `AppSidebar` → `<main>`
- `(app-wide)` — authenticated full-width shell (no sidebar) — `AppHeader` only, **no `ProfileProvider`**; used for `/profile`

Each route group has its own `error.tsx` for route-level error recovery — do not remove them.

### Header height standard
All headers across every route group use **`h-[72px]`** and **`BrandLogo size="md"`** (56 px). This applies to:
- `components/marketing/Header.tsx`
- `modules/auth/components/AuthHeader.tsx`
- `modules/dashboard/components/AppHeader.tsx`

### ProfileContext — one fetch, shared everywhere (dashboard only)
`ProfileProvider` in `(app)/layout.tsx` fetches `GET /api/candidate/profile` **once** using a `useRef(false)` guard (prevents React StrictMode double-invoke). All components in the `(app)` shell call `useProfile()` — never fetch independently.

The `(app-wide)` layout does **not** use `ProfileProvider`. `AppHeader` falls back to `getStoredUserName()` / `getStoredJobTitle()` from localStorage when no context is present — no extra API call. `ProfilePage` fetches `fetchFullProfile()` independently and passes data to panels as props.

### SSR / Hydration rules
Never use time- or environment-dependent values directly in render. They differ between server and client and cause hydration errors:
```tsx
// ❌ causes hydration mismatch
const greeting = new Date().getHours() < 12 ? "Good morning" : "Good afternoon";

// ✅ correct — empty on server, set on client
const [greeting, setGreeting] = useState("");
useEffect(() => { setGreeting(computeGreeting()); }, []);
```
Also add `suppressHydrationWarning` to elements that intentionally differ (e.g., time-based text).

### Server vs Client Components
- Default: **Server Component** (no `"use client"`)
- Add `"use client"` only when using hooks, browser APIs, or event handlers
- `localStorage` is client-only — never read it in `useState` lazy initializers (runs on server). Always read inside `useEffect`.

### Layout & scroll rules
- Root: `h-screen flex flex-col overflow-hidden`
- Scrollable regions: `overflow-y-auto min-h-0` (both required)
- Sidebar: `overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`

### Tailwind v4 custom utilities
Use `@utility` directive in `globals.css` — plain CSS class selectors are NOT recognized:
```css
@utility btn-gradient-brand { background: var(--gradient-brand); }
```

### Profile page layout pattern
`ProfilePage` lives in `(app-wide)` — full width, no AppSidebar. It renders a 3-column layout:
- **Left panel** (`w-[240px]`) — `ProfileLeftPanel`: back link, avatar, contact, strength ring, section nav. Receives all data as props — does **not** call `useProfile()`.
- **Centre** (`flex-1`) — overview card, professional summary, experience, education, skills (stacked)
- **Right panel** (`w-[260px]`) — `ProfileRightPanel`: highlights, key strengths, documents, support

`ProfilePage` uses `fetchFullProfile()` with a `useRef(false)` guard — single API call, StrictMode-safe. Data flows down as props; no context needed.

The in-page section nav in `ProfileLeftPanel` links to sub-routes (`/profile/experience`, `/profile/education`, etc.) — these pages are **pending implementation**.

### Shared utilities — lib/utils.ts
`lib/utils.ts` is the home for cross-cutting utility functions:

```ts
import { toLabel } from "@/lib/utils";
toLabel("FULL_TIME") // → "Full Time"
```

**Never define `toLabel` locally in a component** — import from `lib/utils`. The function lowercases the input before title-casing, which is mandatory for SCREAMING_SNAKE_CASE enum values.

### Shared form validators — candidate-reg/shared/validators.ts
All form validation logic lives in `modules/auth/components/candidate-reg/shared/validators.ts`:

| Export | Use |
|---|---|
| `isValidEmail(v)` | Email format check (replaces inline regex) |
| `isStrongPassword(v)` | Returns error string or `null` |
| `isValidMMYYYY(v)` | MM/YYYY date format; `true` for empty or "Present" |
| `isDateRangeValid(from, to)` | Checks from ≤ to |

**Never duplicate these inline** — always import from validators.

### Confirm-delete pattern — useConfirmDelete()
All components that show a delete confirmation dialog must use the shared hook from `modules/auth/components/candidate-reg/shared/hooks.ts`:

```ts
const { confirm, triggerDelete, resetConfirm } = useConfirmDelete();

// Open the dialog:
triggerDelete(`Delete "${item.name}"?`, () => handleDelete(item.id));

// In the delete handler:
resetConfirm();

// In the JSX:
{confirm.open && (
  <ConfirmDialog label={confirm.label} onConfirm={confirm.onConfirm} onCancel={resetConfirm} />
)}
```

**Never** copy the `useState<ConfirmState>` + `confirmDelete` boilerplate inline again.

### Accessibility baseline (WCAG 2.1 Level A)
- Every `<label>` must have `htmlFor` pointing to its input's `id`
- Every icon-only button must have `aria-label`
- Every inline error message must have `role="alert"` and an `id`; its input must have `aria-describedby` pointing to that id
- The `Field` component in `Step1BasicInfo.tsx` already implements all three — follow the same pattern for new forms

### Variable naming
Use meaningful names — **never** single-letter state variables.

---

## Logo

Official logo at `public/logo.png`. Use `<BrandLogo size="md" />` from `@/components/marketing/BrandLogo` for all headers. Never use `<BrandMark />` SVG or "H" placeholder.

Size map: `sm`=44px · `md`=56px · `lg`=68px. All app/auth headers use `md`.

---

## Design System

Tokens in `app/globals.css` (`@theme` syntax — do not rename):
- **Brand:** `brand-50` → `brand-900` (purple)
- **Neutrals:** `ink-100` → `ink-900`
- **Gradient:** `var(--gradient-brand)` — inline style only inside `"use client"` components
- **Utilities:** `btn-gradient-brand`, `btn-gradient-company`, `page-tint`, `card`, `gradient-text`
- **Fonts:** `Inter` (body), `Plus Jakarta Sans` (`font-display` class)

---

## Auth Integration

### Login (`/login`)
Both `LoginPage.tsx` and `LoginForm.tsx` call `loginUser()` in `auth.service.ts`:
- `POST /api/users/auth/login` — role mapped: `candidate`→`CANDIDATE`, `recruiter`→`RECRUITMENT_COMPANY`
- Stores tokens + userId via SSR-safe helpers → redirects to `/dashboard`

> `authService.login` (mock stub) has been removed. Always use `loginUser()`.

### Registration — Step 1 (with rollback)
1. `registerCandidateUser(data)` → `POST /api/users/auth/register` → stores tokens + **`hiremind_user_name`**
2. `updateCandidateBasicInfo(data)` → `PUT /api/candidate/profile/basic-info`
3. If step 2 fails → `deleteCurrentUser()` → `DELETE /api/users/users/me` (rollback)

Country code is read from `process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE ?? "+91"` — never hardcoded.

### Candidate Profile API
- `fetchCandidateProfile()` → `GET /api/candidate/profile` (authed) — used by `ProfileContext` in `(app)` shell
- Response mapped to `CandidateProfile`: `fullName`, `jobTitle`, `currentLocation`, `phoneNumber`, `profilePicture`
- On success: syncs `hiremind_user_name` and `hiremind_job_title` to localStorage
- `fetchFullProfile()` → same `GET /api/candidate/profile` endpoint — used by `ProfilePage` in `(app-wide)` shell; returns `FullProfile` with all nested arrays (workExperiences, educations, skills, certifications, preferences) plus scalar preference fields (`noticePeriod`, `expectedSalary`, `salaryType`, `preferredLocation`, `openToRelocate`, `additionalPreferences`)

### Auth / Session — 401/403 Handling
`authedFetch` in `candidate.service.ts` redirects to `/login` on any `401` or `403`. Access token TTL: **1440 min** in dev (`users_api/application.properties`).

### Step 2 — Education & Experience
See original detailed docs — APIs unchanged.

### Step 3 — Skills, Certifications, Preferences

#### Employment Types — dynamic from backend
Both `AddExperienceModal` and `PreferencesSection` fetch employment types from `GET /api/candidate/master/employment-types` on mount.

- Backend returns `{ data: [{ name: "FULL_TIME" }, ...] }` from `MasterDataController.getEmploymentTypes()`
- `toLabel()` from `lib/utils.ts` converts enum names to display labels: `"FULL_TIME"` → `"Full Time"`
- Falls back to hardcoded `EMPLOYMENT_TYPE_MAP` / `EMPLOYMENT_TYPES` from `shared/constants.ts` if API fails

#### Employment type storage contract
- `AddExperienceModal` — stores **display label** (e.g. `"Full Time"`) in form state; maps back to enum name via `typeMap` when building payload
- `PreferencesSection` — stores **enum name** (e.g. `"FULL_TIME"`) directly in `pref.employmentTypes`; `buildPreferencesPayload` passes them straight to `preferredEmploymentTypes` — **no re-mapping**
- `Step3Skills` default employment type: `"FULL_TIME"` (enum name, not label)

### Shared UI Patterns (candidate-reg)
- **`ConfirmDialog`** — fixed modal, trash icon, cancel + delete with spinner. Always pair with `useConfirmDelete()` hook.
- **`Tooltip`** — `relative group/tip`; requires no `overflow-hidden` on parent
- **`DotsIndicator`** — 5 dots filled by proficiency level
- **`SpinnerIcon`** — shown on delete button during async ops

---

## What NOT to Do

- **Do not** add `output: "export"` to `next.config.ts`
- **Do not** put `Header`/`Footer` in root `app/layout.tsx`
- **Do not** import from another module's internal files — barrel exports only
- **Do not** hardcode backend ports — use `API.USERS` / `API.CANDIDATE` from `lib/api/config.ts`
- **Do not** call `localStorage.setItem` / `localStorage.removeItem` directly in services — use helpers from `lib/api/config.ts` (they have the SSR guard)
- **Do not** modify Tailwind tokens in `globals.css` without updating `docs/architecture.md`
- **Do not** use single-letter variable names for React state
- **Do not** call `fetchCandidateProfile()` directly in components inside `(app)` — consume `useProfile()` from `ProfileContext`
- **Do not** add `ProfileProvider` to `(app-wide)/layout.tsx` — it causes a duplicate `/profile` API call alongside `fetchFullProfile()` in `ProfilePage`
- **Do not** call `useProfile()` in `ProfileLeftPanel` — it receives all data as props from `ProfilePage`
- **Do not** read `localStorage` in `useState` initializers — use `useEffect` instead
- **Do not** use display labels (e.g. `"Full Time"`) as `preferredEmploymentTypes` payload values — backend expects enum names (`"FULL_TIME"`). Always send enum names to `PUT /profile/preferences`
- **Do not** define `toLabel` locally in any component — import from `lib/utils.ts`
- **Do not** duplicate email/password/date validation inline — import from `shared/validators.ts`
- **Do not** copy the `useState<ConfirmState>` + `confirmDelete` boilerplate — use `useConfirmDelete()` from `shared/hooks.ts`
- **Do not** use `authService.login()` — it has been removed; always call `loginUser()` from `auth.service.ts`
- **Do not** add fake/placeholder personal data as fallback values in review or profile screens — use `"—"` for missing fields

---

## Pending Work (Next Steps)

1. **Step 2 — Education attachment upload** — wire file upload to S3 via candidate API
2. **Step 4 — Review + Submit** — final registration submit endpoint (currently simulates delay)
3. **Token refresh** — replace 401 redirect with silent refresh via NextAuth v5
4. **NextAuth v5** — replace localStorage tokens with real session management
5. **Middleware** — route protection and RBAC
6. **Recruiter registration** — `/register/company`
7. **Dashboard — real data** — replace mock job/stats data with live API calls
8. **Profile — sub-section pages** — implement `/profile/experience`, `/profile/education`, `/profile/skills`, `/profile/preferences` routes; `ProfileOverviewCard` match score from API
9. **LoginPage accessibility** — add `htmlFor`/`id` to all form labels and inputs (same pattern as `Step1BasicInfo.tsx`)
10. **Modal accessibility** — add `htmlFor`/`id`/`aria-describedby` to all form labels/inputs in `AddExperienceModal`, `AddSkillModal`, `AddCertificationModal`, `AddEducationModal`; add `aria-label` to close buttons
11. **candidate.service.ts split** — 434 lines with 7 mixed domains; split into `profile.service.ts`, `experience.service.ts`, `education.service.ts`, `skills.service.ts`, `certifications.service.ts`, `preferences.service.ts`, `master.service.ts`
12. **React Query + Zustand** — install after backend integration complete
13. **ESLint + Prettier** — code quality tooling
