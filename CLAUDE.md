@AGENTS.md

# HireMind Web — Codebase Guide for Claude

## Response Rules
- Always answer in 70 words or less.
- Prefer concise answers.
- No introductions or conclusions.
- Answer directly.

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

### CORS — Next.js Proxy Rewrites
```
Browser → /api/users/*     → Next.js rewrite → host.docker.internal:5001/user-service/*
Browser → /api/candidate/* → Next.js rewrite → host.docker.internal:5002/candidate-service/*
```
Configured in `next.config.ts` using env vars from `.env.local`. Browser never hits backend directly.

> **DevContainer networking:** Next.js runs inside the devcontainer (bridge network). Backends use host network. Use `host.docker.internal` — not `localhost` — in `.env.local` so the proxy can reach the backends from inside Docker.

### Token Storage (pre-NextAuth)
After register/login, `accessToken`, `refreshToken`, `userId` are stored in `localStorage`:
- `hiremind_access_token`
- `hiremind_refresh_token`
- `hiremind_user_id`

Helpers in `lib/api/config.ts`: `getAccessToken()`, `setAccessToken()`, `clearAuth()`.

---

## Environment Variables

`.env.local` (gitignored — never commit):
```bash
# host.docker.internal resolves to the host Mac from inside the devcontainer
USERS_API_URL=http://host.docker.internal:5001/user-service
CANDIDATE_API_URL=http://host.docker.internal:5002/candidate-service
```

**Do NOT** use `NEXT_PUBLIC_` prefix — that bypasses the proxy and causes CORS errors.

**Restart `npm run dev` after any change to `.env.local`.**

---

## Folder Structure

```
hiremind_web/
├── app/                        # Next.js App Router
│   ├── (marketing)/            # Public marketing pages — Header + Footer layout
│   ├── (auth)/                 # Auth flow — each page owns its own full layout
│   │   └── register/candidate/ # /register/candidate  (4-step registration)
│   ├── (app)/                  # Authenticated app shell
│   ├── layout.tsx              # Root layout (html, body, fonts only)
│   └── globals.css             # Tailwind v4 design tokens — do not rename tokens
│
├── components/
│   └── marketing/              # Shared marketing-only UI (Header, Footer, BrandLogo)
│
├── lib/
│   └── api/
│       └── config.ts           # API base URLs + token helpers
│
├── modules/
│   └── auth/
│       ├── types/auth.types.ts
│       ├── services/
│       │   ├── auth.service.ts       # registerCandidateUser(), loginUser(), deleteCurrentUser()
│       │   └── candidate.service.ts  # updateCandidateBasicInfo(), fetchDegreeCourses(), fetchEducationTypes()
│       │                             # addEducation(), updateEducation(), deleteEducation()
│       │                             # addWorkExperience(), updateWorkExperience(), deleteWorkExperience()
│       │                             # fetchSkills(), addCandidateSkill(), updateCandidateSkill(), deleteCandidateSkill()
│       │                             # addCertification(), updateCertification(), deleteCertification()
│       │                             # buildSkillPayload() — Skill → SkillPayload converter
│       │                             # savePreferences(), buildPreferencesPayload() — preferences API
│       └── components/
│           ├── AuthHeader.tsx         # Reusable sticky/non-sticky header
│           ├── AuthStepper.tsx        # Top N-step progress bar
│           ├── LoginPage.tsx
│           ├── RoleSelectionPage.tsx
│           ├── OtpForm.tsx
│           ├── role-selection/
│           │   ├── RoleCard.tsx
│           │   ├── AIPlatformStrip.tsx
│           │   └── TrustStrip.tsx
│           └── candidate-reg/
│               ├── CandidateRegistration.tsx  # Lean orchestrator — state only
│               ├── CandidateSidebar.tsx        # Left panel (all 4 steps)
│               ├── CandidateFormPanel.tsx      # Right panel (title + stepper + steps)
│               ├── ProgressStepper.tsx
│               ├── StepActions.tsx             # Back + Save & Continue buttons
│               ├── ProfileSubmission.tsx
│               ├── shared/
│               │   ├── icons.tsx       # All SVG icon components (named exports)
│               │   ├── ui.tsx          # Tooltip, ConfirmDialog, SectionHeader, EmptyState, DotsIndicator, SelectField
│               │   ├── constants.ts    # MONTHS, PROFICIENCY_LEVELS, POPULAR_SKILLS, EMPLOYMENT_TYPE_MAP, dropdown options
│               │   └── types.ts        # EducationFormData, ExperienceFormData, CertificationFormData, PreferencesData, modal state types
│               ├── modals/
│               │   ├── AddEducationModal.tsx      # Add/Edit education — wired to backend API
│               │   ├── AddExperienceModal.tsx     # Add/Edit experience — main form fields + save logic
│               │   ├── ProjectsSubForm.tsx        # Nested projects editor extracted from AddExperienceModal
│               │   ├── AddSkillModal.tsx          # Add/Edit skill — right panel + orchestration
│               │   ├── SkillLeftPanel.tsx         # Left panel: search + popular skills + added skills list
│               │   └── AddCertificationModal.tsx  # Add/Edit certification — name/institution/year/valid-till/upload
│               ├── sections/
│               │   ├── EducationSection.tsx        # Education cards with add/edit/delete
│               │   ├── CertificationsSection.tsx   # Certifications table with add/edit/delete
│               │   ├── PreferencesSection.tsx      # Preferences form (notice, salary, roles, location, benefits)
│               │   ├── UploadResumeBanner.tsx      # Resume upload prompt banner
│               │   ├── SidebarFeatures.tsx         # Step-1 sidebar content
│               │   └── SidebarProgress.tsx         # Steps 2-4 horizontal progress
│               └── steps/
│                   ├── Step1BasicInfo.tsx      # Calls register + basic-info APIs
│                   ├── Step2Professional.tsx   # Education + Experience sections with edit/delete/expand
│                   ├── Step3Skills.tsx         # Skills table + Certifications table + Preferences — fully API-wired
│                   └── Step4Review.tsx         # Review all steps before submit
│
├── docs/
│   └── architecture.md         # Full architecture reference
├── .env.local                  # Backend URLs (gitignored)
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
- `(auth)` — login/register flows, **each page owns its full-page layout**
- `(app)` — authenticated app shell

### Server vs Client Components
- Default: **Server Component** (no `"use client"`)
- Add `"use client"` only when using hooks, browser APIs, or event handlers

### Layout & scroll rules
- Root: `h-screen flex flex-col overflow-hidden`
- Scrollable regions: `overflow-y-auto min-h-0` (both required)
- Sidebar: `overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`
- Form panel: `flex-1` — no max-width constraint

### Tailwind v4 custom utilities
Use `@utility` directive in `globals.css` — plain CSS class selectors are NOT recognized:
```css
@utility btn-gradient-brand { background: var(--gradient-brand); }
```

### Variable naming
Use meaningful names — **never** single-letter state variables:
- ✅ `currentStep` — ❌ `s`

---

## Logo

Official logo at `public/logo.png`. Use `<BrandLogo height={48} />` from `@/components/marketing/BrandLogo`. Never use `<BrandMark />` SVG or "H" placeholder.

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
`LoginPage.tsx` → `loginUser()` in `auth.service.ts`:
- `POST /api/users/auth/login` — role mapped: `candidate`→`CANDIDATE`, `recruiter`→`RECRUITMENT_COMPANY`
- Stores `accessToken`, `refreshToken`, `userId` in localStorage → redirects to `/dashboard`
- Switching role tabs clears all validation + submit errors

### Step 1 — Candidate Registration (with rollback)
On "Continue" in `Step1BasicInfo`:
1. Validate form — password must match `@StrongPassword`: min 8 + uppercase + lowercase + digit + special char
2. `registerCandidateUser(data)` → `POST /api/users/auth/register` → stores tokens
3. `updateCandidateBasicInfo(data)` → `PUT /api/candidate/profile/basic-info`
4. If step 3 fails → `deleteCurrentUser()` → `DELETE /api/users/users/me` (rollback)
5. `onNext()` → advance to Step 2

Errors surface via red banner above Continue button.

### Step 2 — Education
`AddEducationModal` accepts optional `editId` + `initialData` props — renders as Add or Edit modal.

Master data fetched on mount (no auth required):
- `GET /api/candidate/master/degrees` → degree dropdown
- `GET /api/candidate/master/education-types` → radio buttons

On save:
- Add → `addEducation(payload)` → `POST /api/candidate/profile/educations` → returns backend UUID
- Edit → `updateEducation(id, payload)` → `PUT /api/candidate/profile/educations/:id`
- Delete → `deleteEducation(id)` → `DELETE /api/candidate/profile/educations/:id` (with spinner)

`onSaved(education: Education)` returns full object — `Step2Professional` appends/updates list immediately (no page reload).

Fields: Degree (dropdown), Specialization, Institute/University, Location, Year of Passing (**text**, 4-digit), Grade/Percentage, Education Type (radio), Description, Attachments (UI only).

Required: Degree, Institute/University, Location.

`Education` type fields: `id`, `degree`, `institution`, `specialization`, `location`, `yearOfPassing`, `grade`, `educationType`, `description`.

Displayed as `EducationCard` (same pattern as `ExperienceCard`): degree, institution, specialization, year of passing + location, grade, education type badge, description (line-clamped). Edit/Delete buttons wired.

### Step 2 — Experience
`AddExperienceModal` accepts optional `initialExperience` prop — renders as Add or Edit modal.

Fields: Company Name, Employment Type (dropdown), Total Experience, Job Title, Location, Notice Period, Start/End Date (MM/YYYY), "Currently working here" checkbox (disables End Date).

Projects sub-section: dynamic add/remove — each project has Title, Role, Duration (MM/YYYY–MM/YYYY), Description (1000 char), Skills (tag input — Enter/comma to add).

On save:
- Add → `addWorkExperience(payload)` → `POST /api/candidate/profile/work-experiences` → returns backend UUID
- Edit → `updateWorkExperience(id, payload)` → `PUT /api/candidate/profile/work-experiences/:id`
- Delete → `deleteWorkExperience(id)` → `DELETE /api/candidate/profile/work-experiences/:id` (with spinner)

Date conversion: form `MM/YYYY` → `YYYY-MM-01` (`LocalDate`). Employment type labels mapped to backend enum (`FULL_TIME`, `PART_TIME`, etc.). Skills array joined as comma-separated string (`technologiesUsed`).

The experience list in `Step2Professional` supports edit (opens modal pre-filled), delete (removes from state), and expand/collapse to show nested project cards with skill tags.

### Step 3 — Skills
`AddSkillModal` — 2-panel modal (max-w-[920px]):
- Left panel: search input with debounce (`fetchSkills`), 12 popular skills grid, added skills list with DotsIndicator + proficiency + ⭐ Top badge + delete
- Right panel: proficiency radio (5 levels), experience + unit, lastUsed month/year, years slider (0–10+), Top Skill toggle, additional details

On save:
- Add → `addCandidateSkill(payload)` → `POST /api/candidate/profile/skills` → returns backend UUID
- Edit → `updateCandidateSkill(id, payload)` → `PUT /api/candidate/profile/skills/:id`
- Delete → `deleteCandidateSkill(id)` → `DELETE /api/candidate/profile/skills/:id`

`buildSkillPayload(skill)` converts frontend `Skill` → `SkillPayload`: lastUsed "May 2024" → "2024-05-01", months → fractional years, proficiency label → backend enum.

`ProficiencyLevel` enum: `BEGINNER` | `INTERMEDIATE` | `ADVANCED` | `EXPERT` | `MASTER`

`Skill` type fields: `id`, `name`, `proficiency`, `experienceValue`, `experienceUnit`, `lastUsed`, `yearsOfExperience`, `highlighted` (Top Skill), `additionalDetails`.

### Step 3 — Certifications
`AddCertificationModal` — single-panel modal (max-w-[680px]):

Fields: Certification Name (0/120), Issuing Institution (0/120), Credential ID (optional), Certificate URL (optional), Passed Year (select 1990–current), Valid Till (Month + Year selects), "Does not expire" checkbox, Description (0/500), file upload area.

Footer: "Display on my profile" checkbox + Cancel + Save.

On save:
- Add → `addCertification(payload)` → `POST /api/candidate/profile/certifications` → returns backend UUID
- Edit → `updateCertification(id, payload)` → `PUT /api/candidate/profile/certifications/:id`
- Delete → `deleteCertification(id)` → `DELETE /api/candidate/profile/certifications/:id`

`validTill` sent as `YYYY-MM-DD` (first of month). `doesNotExpire: true` → omit `validTill`.

`Certification` type fields: `id`, `name`, `institution`, `credentialId`, `certificateUrl`, `passedYear`, `validTill` ("May 2025"), `doesNotExpire`, `description`, `displayOnProfile`.

### Step 3 — Preferences
`PreferencesSection` — rendered inside `Step3Skills`, manages its own state, calls `onChange` on every field change.

Fields: Notice Period, Expected Salary (Annual CTC), Salary Type, Job Role Preferences (tag input), Preferred Work Location, Open to Relocate (checkbox), Preferred Employment Type (multi-checkbox), Other Benefits (multi-checkbox), Additional Notes (0/250).

On "Save & Continue" in `Step3Skills`:
- `savePreferences(buildPreferencesPayload(pref))` → `PUT /api/candidate/profile/preferences`
- `buildPreferencesPayload()` maps: `jobRolePreferences` → `rolePreferences`, `employmentTypes` labels → `EmploymentType` enums (`"Full Time"` → `FULL_TIME` etc.), `additionalNotes` → `additionalPreferences`
- Spinner on button + red error banner on failure; `onNext()` only called on success

`PreferencesPayload` fields: `noticePeriod`, `expectedSalary`, `salaryType`, `preferredLocation`, `openToRelocate`, `rolePreferences[]`, `preferredEmploymentTypes[]`, `benefits[]`, `additionalPreferences`.

### Auth / Session — 401/403 Handling
`authedFetch` in `candidate.service.ts` redirects to `/login` on any `401` or `403` response. This handles expired JWT tokens (access token TTL: **1440 min** in dev, configured in `users_api/application.properties`).

> **Note:** After changing `hiremind.security.jwt.access-token-minutes`, rebuild the `users_api` Docker container and re-login to get a fresh token.

### Shared UI Patterns (candidate-reg)
- **`ConfirmDialog`** — fixed modal with trash icon, label, "This action cannot be undone", Cancel + Delete buttons (with spinner). Defined locally in Step2Professional and Step3Skills.
- **`Tooltip`** — `relative group/tip` wrapper; dark tooltip anchored `bottom-full`. Requires no `overflow-hidden` on parent card wrapper (clips upward tooltips).
- **`DotsIndicator`** — 5 dots, filled by proficiency level (1=Beginner…5=Master).
- **`SpinnerIcon`** — shown on the delete button row while async delete is in progress.

---

## What NOT to Do

- **Do not** add `output: "export"` to `next.config.ts`
- **Do not** put `Header`/`Footer` in root `app/layout.tsx`
- **Do not** import from another module's internal files — barrel exports only
- **Do not** hardcode backend ports in service files — use `API.USERS` / `API.CANDIDATE` from `lib/api/config.ts`
- **Do not** modify Tailwind tokens in `globals.css` without updating `docs/architecture.md`
- **Do not** use single-letter variable names for React state

---

## Pending Work (Next Steps)

1. **Step 2 — Education attachment upload** — wire file upload to S3 via candidate API
2. **Step 4 — Review + Submit** — full implementation; final registration submit endpoint
4. **Token refresh** — currently redirects to `/login` on 401/403; replace with silent refresh via NextAuth v5
5. **NextAuth v5** — replace localStorage tokens with real session management
6. **Middleware** — route protection and RBAC
7. **Recruiter registration** — `/register/company`
8. **Dashboard modules** — Jobs, Candidates, Company, Recruiters, Settings
9. **React Query + Zustand** — install after backend integration complete
10. **ESLint + Prettier** — code quality tooling
