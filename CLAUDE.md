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
| company_api | **5003** | `/company-service` | `/Users/femilam/Project/backend/hiremind/company_api` |

All services are Spring Boot (Maven) apps running inside Docker containers with **host network mode**.
PostgreSQL runs on port 5432, Redis on port 6379.
Shared library: `/Users/femilam/Project/backend/hiremind/core_module` — `ApiResponse<T>` record and common utilities.

### Master Data Endpoints (candidate_api — public, no auth)
| Endpoint | Controller method | Source |
|---|---|---|
| `GET /master/degrees` | `getDegrees()` | `degree_courses` table (DB-backed) |
| `GET /master/education-types` | `getEducationTypes()` | `education_types` table (DB-backed) |
| `GET /master/employment-types` | `getEmploymentTypes()` | `EmploymentType` enum (no DB needed) |

All return `ApiResponse<List<{name}>>`. Employment types: `FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, FREELANCE, REMOTE, HYBRID`.

### S3 File Storage (core_module)
S3 support lives in `core_module/src/main/java/com/hiremind/core/storage/`:
- **`S3StorageService`** — interface: `upload(folder, filename, file)` → S3 key; `createPresignedReadUrl(key, ttl)` → URI
- **`AwsS3StorageService`** — real impl (AWS SDK v2); uses `StaticCredentialsProvider` when `hiremind.storage.s3.access.key` + `secret.key` are set, otherwise falls back to `DefaultCredentialsProvider`; activated when `hiremind.storage.s3.bucket` is non-blank
- **`NoopS3StorageService`** — throws `BusinessException("S3_NOT_CONFIGURED")` when bucket is empty
- **`S3StorageAutoConfiguration`** — injects `Environment` to read credentials (bypasses `@ConfigurationProperties` record binding limitation); auto-configures: real impl if bucket set, noop otherwise

S3 config in `candidate_api/application.properties`:
```properties
hiremind.storage.s3.bucket=hiremind-s3   # set to your bucket name to activate real S3
hiremind.storage.s3.region=ap-south-1
hiremind.storage.s3.base-folder=hiremind/${spring.profiles.active:local}
hiremind.storage.s3.access.key=          # explicit creds; omit to use DefaultCredentialsProvider
hiremind.storage.s3.secret.key=
spring.profiles.active=local             # controls env prefix: local | dev | prod
```

> **S3 path format:** `{baseFolder}/resumes/{profileId}/...` → e.g. `hiremind/local/resumes/{id}/...`

### File Upload Endpoints (candidate_api — authed)
| Endpoint | Method | Description |
|---|---|---|
| `POST /profile/resume/upload` | `uploadResume()` | Multipart — stores key in `candidate.resume_file_key` |
| `POST /profile/certifications/{id}/upload` | `uploadCertificateFile()` | Multipart — stores key in `certification.certificate_file_key` |
| `POST /profile/educations/{id}/upload` | `uploadEducationFile()` | Multipart — appends key to `candidate_educations.attachment_file_keys` (comma-separated TEXT) |
| `POST /profile/picture/upload` | `uploadProfilePicture()` | Multipart — stores key in `candidate.profile_picture_key`; returns updated `CandidateProfileResponse` |

All accept `@RequestParam("file") MultipartFile file`. S3 key format:
- Resume: `{baseFolder}/resumes/{profileId}/{profileId}_resume_{filename}`
- Cert doc: `{baseFolder}/certificates/{profileId}/{certId}_{filename}`
- Edu attachment: `{baseFolder}/educations/{profileId}/{eduId}_{filename}`
- Profile picture: `{baseFolder}/pictures/{profileId}/{profileId}_picture_{filename}`

**DB migrations:**
- `V4__add_resume_file_key.sql` — adds `resume_file_key VARCHAR(500)` to `candidate` table
- `V5__add_education_attachments.sql` — adds `attachment_file_keys TEXT` to `candidate_educations` table (comma-separated S3 keys)
- `V6__add_professional_summary.sql` — adds `professional_summary TEXT` to `candidate` table
- `V7__add_profile_picture_key.sql` — adds `profile_picture_key VARCHAR(500)` to `candidate` table

### CORS — Next.js Proxy Rewrites
```
Browser → /api/users/*     → Next.js rewrite → host.docker.internal:5001/user-service/*
Browser → /api/candidate/* → Next.js rewrite → host.docker.internal:5002/candidate-service/*
Browser → /api/company/*   → Next.js rewrite → host.docker.internal:5003/company-service/*
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
| `hiremind_company_name` | `getStoredCompanyName()` / `setStoredCompanyName()` |

`clearAuth()` wipes all six keys. `hiremind_user_name` is written at candidate registration and kept in sync by `fetchCandidateProfile()`. `hiremind_company_name` is written at company registration by `registerCompanyUser()`.

---

## Environment Variables

`.env.local` (gitignored — never commit):
```bash
USERS_API_URL=http://host.docker.internal:5001/user-service
CANDIDATE_API_URL=http://host.docker.internal:5002/candidate-service
COMPANY_API_URL=http://host.docker.internal:5003/company-service
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
│       ├── EditProfilePage.tsx        # "use client" — 4-tab edit page; reuses reg sections; maps FullProfile → reg types
│       ├── ImproveMatchPage.tsx       # "use client" — match score breakdown, key areas accordion, actions panel
│       ├── context/
│       │   └── ProfileContext.tsx     # Single profile fetch (useRef guard); shared via useProfile()
│       └── components/
│           ├── AppHeader.tsx          # "use client" — full-width h-[72px] header, logo zone bg-white, greeting + logout dropdown
│           ├── AppSidebar.tsx         # "use client" — left nav, profile card, premium upsell
│           ├── StatCard.tsx           # Reusable stat tile
│           ├── JobCard.tsx            # Job listing card with match %, fake/ghost badges
│           ├── MatchInsightsPanel.tsx # Donut chart (conic-gradient) + legend + "Improve Your Match" link
│           ├── JobAlertsPanel.tsx     # "use client" — toggleable alerts
│           ├── CareerTipsPanel.tsx    # Static career tips list
│           └── profile/
│               ├── ProfileLeftPanel.tsx    # Back link, avatar (self-center), contact, strength ring; 4-item section nav (Overview/Experience/Education/Skills); IntersectionObserver active tracking on /profile; onSectionClick prop for center-panel highlight; "Improve Profile" → /profile/edit
│               ├── ProfileOverviewCard.tsx # 8-field grid + match score donut with progress bars
│               └── ProfileRightPanel.tsx   # Highlights, key strengths, documents, need help (not rendered — kept for future use)
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
| `/profile/edit` | Candidate profile edit (4 tabs) | ✅ Built + API wired |
| `/improve-match` | Improve match score page | ✅ Built (mock data) |
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
Both `ProfilePage` and `EditProfilePage` live in `(app-wide)` — full width, no AppSidebar. Both render a **2-column layout** (right panel removed):
- **Left panel** (`w-[240px]`) — `ProfileLeftPanel`: back link, avatar (`self-center`), contact, strength ring, 4-item section nav. Accepts `backHref`/`backLabel` (defaults: `/dashboard` / "Back to Dashboard"). `EditProfilePage` passes `backHref="/profile"` / `backLabel="Back to Profile"`.
- **Centre** (`flex-1`) — `ProfilePage`: overview card + professional summary + experience + education + skills (all with section IDs for scroll). `EditProfilePage`: 4-tab editor with all tab content wrapped in `card` for visual consistency.

Both pages use `fetchFullProfile()` with a `useRef(false)` guard. `EditProfilePage` maps `FullProfile` → registration types on load to pre-populate existing section components.

#### ProfileLeftPanel — section nav behaviour
On `/profile` (exact path), the 4 nav items become scroll buttons backed by `IntersectionObserver` (root: `<main>`, threshold 0.2, rootMargin `-80px 0px -40% 0px`). Clicking calls `scrollIntoView` + fires `onSectionClick?(sectionId)`. On any other path, they behave as normal `<Link>` route links and active state is determined by `usePathname()`.

**Section IDs in `ProfilePage`:** `profile-overview`, `profile-experience`, `profile-education`, `profile-skills`.

**Center-panel highlight:** `ProfilePage` tracks `highlightedSection` state (auto-clears after 1.5 s via `setTimeout`). When a nav item is clicked, `handleSectionClick` sets `highlightedSection`; the matching section's `<h2>` and header row receive `bg-brand-50` + `text-brand-600` via `transition-colors duration-500`.

#### Edit Profile — tab card consistency
All tab content uses `space-y-4` root with inner `card` wrappers — no tab should render bare content without a card background:
- **Basic Info**: `card p-5` wraps all fields; Save button sits outside
- **Experience**: `EducationSection` wrapped in `card`; experience `<section>` replaced by `card p-5`
- **Skills**: Skills section wrapped in `card p-5` (inner table uses `rounded-xl border` only); `CertificationsSection` wrapped in `card`
- **Preferences**: `PreferencesSection` wrapped in `card`; Save button has no extra horizontal padding

### Edit Profile — data mapping (`EditProfilePage.tsx`)
On load, `FullProfile` is mapped to registration types so existing modal-based sections work unchanged:
- `WorkExperienceProfile` → `Experience`: ISO dates → `MM/YYYY`, enum names → display labels via `toLabel()`
- `EducationProfile` → `Education`: nullable fields default to `""`
- `SkillProfile` → `Skill`: proficiency reverse-mapped (`BEGINNER` → `"Beginner"`, etc.); **no `yearsOfExperience` mapping** (field removed)
- `CertificationProfile` → `Certification`: `validTill` ISO → `"Month YYYY"` display format
- `FullProfile` scalars + `PreferenceProfile[]` → `PreferencesData`; preferences filtered by `type === "ROLE" | "EMPLOYMENT_TYPE" | "BENEFIT"`
- `preferredLocations` mapped from `fp.preferredLocation` by splitting on `", "` — stored as `string[]`
- Basic Info tab includes **Professional Summary** textarea pre-populated from `fp.professionalSummary`

Each tab saves independently via existing APIs — no "Save All" button.

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

### Registration — Step 1 (with OTP verification + rollback)
**Step 1 form fields:** full name, email (+ OTP), phone (+ OTP), password, job title, current location, Professional Summary textarea (2000-char limit). The "Where did you hear about us?" select, OR divider, and Google/Apple OAuth buttons have been **removed**.

1. User enters email + phone → clicks "Send OTP" for each → OTP verified → `VerifiedIcon` shown
2. `registerCandidateUser(data)` → `POST /api/users/auth/register` → stores tokens + **`hiremind_user_name`**; `source` is always `null` (hear-about-us removed)
3. `updateCandidateBasicInfo(data)` → `PUT /api/candidate/profile/basic-info`; sends `professionalSummary`
4. If step 3 fails → `deleteCurrentUser()` → `DELETE /api/users/users/me` (rollback)

**Back-navigation guard (`isReturning` prop):**
- `CandidateRegistration` tracks `maxStep` (highest step reached); `CandidateFormPanel` passes `isReturning={maxStep > 1}` to `Step1BasicInfo`
- When `isReturning=true`: email + phone fields are **disabled**, OTP UI hidden, registration + rollback skipped on Continue — only `updateCandidateBasicInfo` runs

Country code is read from `process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE ?? "+91"` — never hardcoded.

### Candidate Profile API
- `fetchCandidateProfile()` → `GET /api/candidate/profile` (authed) — used by `ProfileContext` in `(app)` shell
- Response is mapped explicitly (not cast directly): `raw.profilePictureUrl → profilePicture`, `raw.currentRole → jobTitle`
- On success: syncs `hiremind_user_name` (from `raw.fullName`) and `hiremind_job_title` (from `raw.currentRole`) to localStorage
- `fetchFullProfile()` → same `GET /api/candidate/profile` endpoint — used by `ProfilePage` in `(app-wide)` shell; returns `FullProfile` with all nested arrays plus scalar fields (`noticePeriod`, `expectedSalary`, `salaryType`, `preferredLocation`, `openToRelocate`, `additionalPreferences`, `resumeFileKey`, `professionalSummary`, `profilePictureKey`, `profilePictureUrl`)
- `profilePictureUrl` — presigned S3 URL generated by `CandidateProfileService.buildPresignedUrl()` (try-catch, returns null if S3 not configured / NoopS3StorageService)

### Company Registration (`/register/company`)
`modules/auth/services/company.service.ts` handles company account auth:
- `registerCompanyUser(data: CompanyRegStep2Data)` → `POST /api/users/auth/register` with `accountType: RECRUITMENT_COMPANY`
  - Stores tokens + userId via SSR-safe helpers; writes **`hiremind_company_name`** via `setStoredCompanyName()`
  - Throws with field-level error message on failure
- `deleteCurrentCompany()` → `DELETE /api/users/users/me` (rollback; mirrors `deleteCurrentUser()` in auth.service.ts)

**Types** (`auth.types.ts`):
- `CompanyRegStep1Data` — company details (name, legalName, website, industry, companySize, etc.)
- `CompanyRegStep2Data` — admin details (fullName, designation, email, mobile, password, timeZone, etc.)
- `CompanyRegData` — `{ step1: CompanyRegStep1Data; step2: CompanyRegStep2Data }`

**Registration flow:**
1. Step 1 (Company Details) — validated locally; data stored in parent `CompanyRegistration` state; **no API call**
2. Step 2 (Admin Details) — validates → `registerCompanyUser(step2Data)` → tokens stored → advance to Step 3
3. Step 3 (Verification) — OTP stub (visual only); "Verify & Complete" → `router.push("/company/dashboard")`

**Pending:** `PUT /api/company/profile` call to save Step 1 company details (after `company_api` is running).

### Company Profile API (`company_api`)
Endpoints under `API.COMPANY` (`/api/company`) — all require Bearer JWT + `accountType = RECRUITMENT_COMPANY`:
- `GET /api/company/profile` — get profile (auto-creates DRAFT on first call)
- `PUT /api/company/profile` — create or update company details; transitions DRAFT → ACTIVE on first save
- `POST /api/company/logo/upload` — multipart logo upload; returns updated `CompanyProfileResponse`

### Auth / Session — 401/403 Handling
`authedFetch` in `candidate.service.ts` redirects to `/login` on any `401` or `403`. Access token TTL: **1440 min** in dev (`users_api/application.properties`).

### Step 2 — Education & Experience
See original detailed docs — APIs unchanged.

### S3 File Uploads (frontend)

`candidate.service.ts` exposes upload functions and a multipart helper:

```ts
// Multipart helper — omits Content-Type so the browser sets the boundary
authedUpload(path, formData)   // internal — do not import directly

// Public API
uploadResume(file: File): Promise<string | null>                 // returns resumeFileKey
uploadCertificateFile(certId: string, file: File): Promise<void>
uploadEducationFile(eduId: string, file: File): Promise<void>
uploadProfilePicture(file: File): Promise<string | null>         // returns profilePictureKey
```

**Profile picture upload (Step4Review):**
- Wired in `Step4Review.tsx`: avatar circle shows initials or preview; "Upload Photo" / "Change" button below
- Validates image type and size (≤ 5 MB) before upload; shows uploading spinner and error state
- `picturePreview` (data URL) shown immediately; S3 key stored via `uploadProfilePicture(file)`

**`UploadResumeBanner`** (`sections/UploadResumeBanner.tsx`):
- Props: `resumeFileKey?: string` (truthy → starts in success state), `onUploaded?: (fileName, resumeFileKey) => void`
- Validates type (PDF, DOCX only) and size (≤ 5 MB) before uploading
- States: idle → uploading (spinner) → success (green, "Replace" button) / error (red message)
- `onUploaded` receives both file name and the S3 key returned by the API; Step2 stores key in `data.resumeFileKey`

**`AddCertificationModal`** — file upload flow:
1. User picks file from wired drop zone (click to browse); edit mode pre-populates existing key
2. `handleSave` saves cert metadata first → gets `certId`
3. `uploadCertificateFile(certId, file)` runs after — **non-fatal**: cert is saved even if upload fails
4. `onSaved` callback includes `certificateFileKey` if upload succeeded

**`AddEducationModal`** — multi-attachment flow:
1. Hidden `<input type="file" multiple>` triggered by the drop zone button
2. New files shown in blue list; existing S3 keys shown from `existingAttachments` prop (populated from `edu.attachmentFileKeys` on edit)
3. Each file/key has an individual remove button
4. `handleSave` uploads each file in `newFiles` after saving education — **non-fatal** per file
5. `onSaved` returns `attachmentFileKeys: [...keptExistingKeys, ...uploadedFileNames]`
6. `EduModalState` (shared/types.ts) includes `existingAttachments?: string[]`; `EducationSection` passes `edu.attachmentFileKeys` when opening edit

**Type changes:**
- `Certification` (auth.types.ts) — added `certificateFileKey?: string`
- `Education` (auth.types.ts) — added `attachmentFileKeys?: string[]`
- `Skill` (auth.types.ts) — **removed** `yearsOfExperience: number` (slider removed; `experienceYears` sent via `buildSkillPayload` instead)
- `CandidateRegStep1Data` (auth.types.ts) — `hearAboutUs: string` replaced with `professionalSummary: string`
- `CandidateRegStep3Data` (auth.types.ts) — `preferredLocation: string` replaced with `preferredLocations: string[]`
- `FullProfile` (candidate.service.ts) — added `resumeFileKey: string | null`, `professionalSummary: string | null`, `profilePictureKey: string | null`, `profilePictureUrl: string | null`
- `CertificationProfile` (candidate.service.ts) — added `certificateFileKey?: string | null`
- `EducationProfile` (candidate.service.ts) — added `attachmentFileKeys?: string[] | null`
- `CandidateRegStep2Data` (auth.types.ts) — added `resumeFileKey: string`

### Step 3 — Skills, Certifications, Preferences

#### Add Skill modal — current state
- **Years of Experience slider removed** — the slider UI and `yearsOfExperience` field are gone. Experience is still captured via the "Experience in this skill" inputs (`experienceValue` + `experienceUnit`) and sent as `experienceYears` (decimal) via `buildSkillPayload`.
- **Top Skill** — replaced the toggle button with a checkbox (`<input type="checkbox">`); same `topSkill` boolean sent to backend.

#### Preferred Work Location — multi-select
`PreferencesSection` renders `LOCATION_OPTIONS` as checkboxes; selected values stored in `pref.preferredLocations: string[]`. `buildPreferencesPayload` joins them with `", "` → single `preferredLocation` string for the backend. `EditProfilePage` splits the stored string back to `string[]` on load.

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
- **`VerifiedIcon`** (`shared/icons.tsx`) — small green circle with checkmark; shown inline after successful OTP verification in Step1
- **`GraduationCapIcon`** (`shared/icons.tsx`) — used in `AddEducationModal` header (matches `BriefcaseIcon` style in `AddExperienceModal`)

---

## What NOT to Do

- **Do not** add `output: "export"` to `next.config.ts`
- **Do not** put `Header`/`Footer` in root `app/layout.tsx`
- **Do not** import from another module's internal files — barrel exports only
- **Do not** hardcode backend ports — use `API.USERS` / `API.CANDIDATE` / `API.COMPANY` from `lib/api/config.ts`
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
- **Do not** use `authedFetch` for file uploads — it forces `Content-Type: application/json` which breaks multipart boundaries. Use `authedUpload()` from `candidate.service.ts` instead
- **Do not** set `Content-Type: multipart/form-data` manually — omit it entirely; the browser sets it with the correct boundary automatically
- **Do not** add `hearAboutUs` back to `CandidateRegStep1Data` — it has been replaced by `professionalSummary`
- **Do not** use `preferredLocation: string` in `CandidateRegStep3Data` — it is now `preferredLocations: string[]`; the backend join (`", "`) happens in `buildPreferencesPayload`
- **Do not** add a `yearsOfExperience` field to the `Skill` interface or `AddSkillModal` — experience is captured via `experienceValue`/`experienceUnit` and sent as `experienceYears` via `buildSkillPayload`
- **Do not** add `<AuthStepper>` to `RoleSelectionPage` (signup page) — it has been removed

---

## Pending Work (Next Steps)

1. **Profile page — resume download** — add presigned URL endpoint (`GET /profile/resume/download`) so the download button can open the S3 file; Download Resume button removed from view profile for now (picture display is done via `profilePictureUrl` in the profile response)
2. **Edit profile — Basic Info extended fields** — `updateCandidateBasicInfo` currently ignores `linkedinUrl` (hardcoded null); add LinkedIn + currentRole/currentCompany fields once backend DTO supports them
3. **Improve Match — real data** — wire match score, key areas, and skill suggestions from API instead of mock data
4. **Step 4 — Review + Submit** — final registration submit endpoint (currently simulates delay)
5. **Token refresh** — replace 401 redirect with silent refresh via NextAuth v5
6. **NextAuth v5** — replace localStorage tokens with real session management
7. **Middleware** — route protection and RBAC
8. **Company registration — wire Step 1 to company_api** — after Step 2 registration succeeds, call `PUT /api/company/profile` with Step 1 company details; currently Step 1 data is stored in React state only
9. **Company dashboard** — `/company/dashboard` — replace static page with real data from `company_api`
10. **Dashboard — real data** — replace mock job/stats data with live API calls
11. **Profile — sub-section pages** — implement `/profile/experience`, `/profile/education`, `/profile/skills`, `/profile/preferences` routes; `ProfileOverviewCard` match score from API
12. **LoginPage accessibility** — add `htmlFor`/`id` to all form labels and inputs (same pattern as `Step1BasicInfo.tsx`)
13. **Modal accessibility** — add `htmlFor`/`id`/`aria-describedby` to all form labels/inputs in `AddExperienceModal`, `AddSkillModal`, `AddCertificationModal`, `AddEducationModal`; add `aria-label` to close buttons
14. **candidate.service.ts split** — mixed domains; split into `profile.service.ts`, `experience.service.ts`, `education.service.ts`, `skills.service.ts`, `certifications.service.ts`, `preferences.service.ts`, `master.service.ts`, `upload.service.ts`
15. **React Query + Zustand** — install after backend integration complete
16. **ESLint + Prettier** — code quality tooling
