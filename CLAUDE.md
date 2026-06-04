@AGENTS.md

# HireMind Web — Codebase Guide for Claude

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

**Not yet installed** (add when backend integration begins):
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
npm run dev     # http://localhost:3000
npm run build   # production build
npm run start   # start production server
```

The `.devcontainer/` folder has `devcontainer.json` + `Dockerfile` (Node 20 / Debian Bookworm). VS Code extensions (TypeScript, Tailwind IntelliSense, ESLint, Prettier) are auto-installed on container start.

---

## Folder Structure

```
hiremind_web/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # Public marketing pages — Header + Footer layout
│   │   ├── layout.tsx
│   │   ├── page.tsx            # /  (home)
│   │   ├── features/
│   │   ├── ai-capabilities/
│   │   ├── pricing/
│   │   └── faq/
│   ├── (auth)/                 # Auth flow — each page owns its own full layout
│   │   ├── layout.tsx          # Minimal passthrough wrapper
│   │   ├── login/              # /login
│   │   ├── signup/             # /signup  (role selection)
│   │   ├── otp/                # /otp?email=...
│   │   └── register/
│   │       └── candidate/      # /register/candidate  (4-step registration)
│   ├── (app)/                  # Authenticated app shell
│   │   ├── layout.tsx          # Topbar + nav
│   │   └── dashboard/          # /dashboard
│   ├── layout.tsx              # Root layout (html, body, fonts only — no Header/Footer)
│   └── globals.css             # Tailwind v4 design tokens — do not rename tokens
│
├── components/
│   └── marketing/              # Shared marketing-only UI
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── CTABanner.tsx
│       └── BrandMark.tsx
│
├── modules/                    # Feature modules — all domain logic
│   └── auth/
│       ├── types/auth.types.ts
│       ├── services/auth.service.ts   # ← STUBS — replace with real API calls
│       └── components/
│           ├── LoginPage.tsx          # Full login page UI
│           ├── RoleSelectionPage.tsx  # /signup — choose Candidate or Company
│           ├── OtpForm.tsx
│           └── candidate-reg/
│               ├── CandidateRegistration.tsx  # Orchestrates all 4 steps
│               ├── ProgressStepper.tsx
│               ├── Step1BasicInfo.tsx
│               ├── Step2Professional.tsx
│               ├── Step3Skills.tsx
│               └── Step4Review.tsx
│
├── docs/
│   └── architecture.md         # Full architecture reference
├── .devcontainer/
│   ├── devcontainer.json
│   └── Dockerfile
└── next.config.ts              # Minimal config — no basePath, no output:export
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
| `/register/candidate` | 4-step candidate registration | ✅ Built |
| `/dashboard` | Candidate dashboard (placeholder) | ✅ Stub |
| `/jobs` | Job listings | ⏳ Pending |
| `/candidates` | Candidate search (recruiter) | ⏳ Pending |
| `/company` | Company profile | ⏳ Pending |
| `/recruiters` | Recruiter management | ⏳ Pending |
| `/settings` | Settings | ⏳ Pending |

---

## Architecture Rules

### Route groups
- `(marketing)` — public pages, uses `Header + Footer` layout
- `(auth)` — login/register flows, **each page owns its full-page layout** (the group layout is a passthrough)
- `(app)` — authenticated app shell

### Server vs Client Components
- Default: **Server Component** (no `"use client"`)
- Add `"use client"` only when using: hooks (`useState`, `useEffect`), browser APIs, event handlers, `useRouter`, or React Query/Zustand

### Module isolation rule
A module in `modules/[name]/` may only import from:
- Its own subtree
- `components/ui/` (not yet created — use inline styles for now)
- Another module's `index.ts` barrel export only

### Import path alias
`@/` resolves to the project root. Use it everywhere:
```ts
import LoginPage from "@/modules/auth/components/LoginPage";
import CTABanner from "@/components/marketing/CTABanner";
```

---

## Logo

Official logo is at **`public/logo.png`** (transparent PNG, 1536×1024, aspect 1.5:1 — icon + "HireMind" wordmark in one image).

Use `<BrandLogo height={48} />` from `@/components/marketing/BrandLogo` in all headers. Never use the old `<BrandMark />` SVG or any "H" placeholder div for branding. See `docs/architecture.md` for the full pattern.

---

## Design System

All design tokens are defined in `app/globals.css` using Tailwind v4 `@theme` syntax.

**Brand colours:** `brand-50` → `brand-900` (purple)
**Neutrals:** `ink-100` → `ink-900`
**Gradient:** `var(--gradient-brand)` — use inline `style={{ background: "var(--gradient-brand)" }}`
**Page tint:** `class="page-tint"` — faint purple radial bg
**Card:** `class="card"` — white card with border + shadow
**Gradient text:** `class="gradient-text"` — purple gradient over text

**Fonts (Google CDN, loaded in root layout):**
- Body: `Inter`
- Display/headings: `Plus Jakarta Sans` → use `font-display` class

---

## Auth Flow (Frontend Only — No Backend Yet)

```
/login  ──── "Create one" ────►  /signup
                                     │
                        "I'm a Candidate" ──► /register/candidate
                                     │              │
                                     │          Steps 1→2→3→4
                                     │              │
                        "I'm a Company" ──► /register/company (stub)

/login  ──── submit ────────────────────────────────────────────► /dashboard
/otp    ──── verify ────────────────────────────────────────────► /dashboard
```

The `auth.service.ts` file has **stub functions** that simulate API delays and return mock data. Every stub has a `// TODO: POST /api/auth/...` comment. Replace each when the backend is ready.

---

## Candidate Registration Steps

The 4-step flow lives in `modules/auth/components/candidate-reg/`:

| Step | Component | Key fields |
|---|---|---|
| 1 Basic Info | `Step1BasicInfo.tsx` | First/last name, email, phone (+91), password, DOB, location, terms |
| 2 Professional | `Step2Professional.tsx` | Education table, experience accordion, nested projects |
| 3 Skills & Prefs | `Step3Skills.tsx` | Skill tags (⭐ highlight), certifications table, preferences |
| 4 Review | `Step4Review.tsx` | Summary review → submit |

State is managed in `CandidateRegistration.tsx` (parent) and passed down as props. Step navigation is internal React state (not URL params).

---

## File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `LoginPage.tsx` |
| Hooks | `useCamelCase.ts` | `useJobs.ts` |
| Services | `camelCase.service.ts` | `auth.service.ts` |
| Zustand slices | `camelCase.slice.ts` | `jobs.slice.ts` |
| Zod schemas | `camelCase.schema.ts` | `login.schema.ts` |
| Type files | `camelCase.types.ts` | `auth.types.ts` |
| Next.js files | lowercase | `page.tsx`, `layout.tsx` |

---

## What NOT to Do

- **Do not** add `output: "export"` back to `next.config.ts` — it was removed intentionally (blocks API routes and middleware)
- **Do not** put `Header` or `Footer` in the root `app/layout.tsx` — they belong only in `app/(marketing)/layout.tsx`
- **Do not** import from another module's internal files — use barrel exports only
- **Do not** add `"use client"` to page files unless absolutely necessary — keep pages as Server Components
- **Do not** modify the Tailwind design tokens in `globals.css` without updating `docs/architecture.md`

---

## Pending Work (Next Steps)

1. **Backend integration** — swap `auth.service.ts` stubs with real API calls
2. **NextAuth v5** — replace stub session with real auth (`lib/auth/next-auth.config.ts`)
3. **Middleware** — add `middleware.ts` for route protection and RBAC
4. **Recruiter registration** — `/register/company` (same pattern as candidate)
5. **Dashboard modules** — Jobs, Candidates, Company, Recruiters, Settings
6. **React Query + Zustand** — install and wire up once backend is ready
7. **ESLint + Prettier** — add code quality tooling
