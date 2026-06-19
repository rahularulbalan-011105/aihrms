# HireMind Web — Enterprise Next.js Architecture

## Logo

The official HireMind logo is stored at **`public/logo.png`** (transparent PNG, 1536 × 1024 px, aspect ratio 1.5 : 1). It contains both the magnifying-glass-with-people icon and the "HireMind" wordmark in one image.

**Use `BrandLogo` everywhere — never recreate the logo in SVG/text:**

```tsx
// Standard usage (headers, navigation)
import BrandLogo from "@/components/marketing/BrandLogo";
<BrandLogo height={48} />   // 48 × 72 px — default marketing header
<BrandLogo height={44} />   // compact auth/registration headers
<BrandLogo height={36} />   // very small / mobile
```

For components deep inside `modules/` that cannot import from `@/components/marketing/`, use the inline helper already present in those files:

```tsx
function BrandLogoImg({ height = 48 }: { height?: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="HireMind" style={{ height: `${height}px`, width: "auto" }} />;
}
```

**Do not** use the old `<BrandMark />` SVG (brain icon) or any "H" placeholder `<div>` for branding.

---

## Overview

HireMind is an AI-powered recruitment platform. The `hiremind_web` app is built on Next.js (App Router), React 19, TypeScript 5 (strict), and Tailwind CSS v4. This document defines the architecture, module organization, coding standards, and key decisions for all developers working on this codebase.

---

## Part 1 — Reference Project Analysis

### Key patterns adopted from the reference project

| Pattern | How it's used in HireMind |
|---|---|
| Feature-based module structure | `modules/auth/`, `modules/jobs/`, `modules/candidates/`, etc. |
| Axios instances with request/response interceptors | Single Axios client in `lib/api/client.ts` with token injection and refresh queue |
| Token refresh queue (blocks concurrent 401s) | Implemented inside Axios response interceptor |
| Three-level auth guards (Guest, Auth, status-driven) | Replaced with Next.js Edge Middleware (`middleware.ts`) |
| Redux Toolkit (persistent) + React Query (server state) | Redux replaced by Zustand; React Query retained for all server state |
| `react-hook-form` + Yup for all forms | `react-hook-form` + Zod (better TypeScript inference) |
| Centralized toast dispatch in every async action | `sonner` toast called from React Query `onError`/`onSuccess` |
| Manual JWT storage in localStorage | Eliminated — NextAuth manages the full session lifecycle |
| WebSocket (STOMP) for real-time notifications | Retained; `useWebSocket` hook connects once from the app shell layout |
| Route-per-feature separation | Next.js route groups: `(marketing)`, `(auth)`, `(app)` |

---

## Part 2 — Recommended Architecture

### Core decisions

1. **App Router only** — all routes live in `app/`; no Pages Router.
2. **Route groups** separate concerns without affecting URLs: `(marketing)`, `(auth)`, `(app)`.
3. **Next.js Middleware** (`middleware.ts`) handles route protection at the Edge — runs before any React rendering.
4. **NextAuth v5 (Auth.js)** manages all session and token lifecycle — no manual JWT storage in localStorage.
5. **React Query** for all server/cache state. **Zustand** for client/UI state (filters, sidebar, notification counts). **NextAuth session** for auth identity.
6. **BFF pattern** — `app/api/` routes proxy to the real backend; the backend URL is never exposed to the browser.
7. **Server Components by default** — add `"use client"` only when hooks, events, or browser APIs are required.
8. **`output: "export"` must be removed** — it blocks API routes, middleware, and SSR entirely.

---

## Part 2b — Component Standards

### Images
- Always use **`next/image`** (`import Image from "next/image"`). Never use raw `<img>` tags — they skip optimisation, lazy loading, and LCP hints.
- For logos with fixed height and fluid width: `<Image src="…" height={h} width={w} style={{ width: "auto" }} priority />`

### Navigation
- Use **`<Link href="…">`** for all in-app navigation, including CTA buttons styled as links. Never call `router.push()` for simple navigation — it forces a Client Component unnecessarily.

### Inline styles
- **No `style={{ … }}` props** for design values. Use Tailwind classes or named CSS utilities in `globals.css`.
- Gradient buttons: use `.btn-gradient-brand` or `.btn-gradient-company` (defined in `globals.css`).

### Server vs Client Components
- **Default: Server Component** — no `"use client"` unless the component uses hooks (`useState`, `useEffect`), browser APIs, or event handlers that cannot be lifted.
- Avoid `useRouter` just for navigation — replace with `<Link>` and keep the component a Server Component.

### Component extraction
- Reusable UI units (e.g. `RoleCard`) live in a **subfolder** of the module they belong to: `modules/auth/components/role-selection/RoleCard.tsx`.
- A module file that exceeds ~150 lines should be split: extract sub-components into the module subfolder, keep the page file as a thin orchestrator.
- Cross-page primitives (icons, form fields, formatters) belong in a module-level `shared/` folder; cross-page UI (stat tiles, badges, charts) in a module-level `components/` folder — **never redefine them inline per page**.
- **Worked example — `modules/company/jobs/`:** each page (`JobsList`, `EditJobPage`, `JobApplicationsPage`, `CompareCandidatesPage`, `PublishSuccess`) is a thin orchestrator. Shared: `shared/icons.tsx` (one icon set, `size`/`className` props), `shared/forms.tsx`, `shared/format.ts`; `components/` (`StatCard`, `FilterSelect`, `JobStatusBadge`, `Donut`) + page-local folders (`jobs-list/`, `edit-job/`, …) for that page's cards/rows/rails + mock `data.ts`. Pages with a genuinely distinct icon language (Compare, PublishSuccess) keep it local rather than forcing it into the shared set.

### Layout & scroll rules
- Full-page auth/registration screens use `h-screen flex flex-col overflow-hidden` on the root wrapper.
- Every scrollable region needs **both** `overflow-y-auto` **and** `min-h-0` — without `min-h-0` flex children ignore the parent constraint and overflow.
- Left sidebars on registration pages: `overflow-y-auto min-h-0` so features + trust badge remain reachable even on small screens.
- Avoid `max-w-[…]` on the right form panel — let it fill available space with `flex-1`.
- Form card padding: `p-4 lg:p-5`. Field grid gap: `gap-3`. Input vertical: `py-2`. Section gaps: `mt-3`.

### Shared auth components (modules/auth/components/)
| File | Purpose |
|---|---|
| `AuthHeader.tsx` | Sticky/non-sticky header; props: `cta`, `border`, `sticky`, `preCtaText` |
| `AuthStepper.tsx` | Top-level N-step progress indicator; props: `steps[]`, `activeStep` |
| `role-selection/RoleCard.tsx` | Left-illustration + right-content card with full-width CTA |
| `role-selection/AIPlatformStrip.tsx` | AI feature pills strip |
| `role-selection/TrustStrip.tsx` | Company logo trust bar |
| `candidate-reg/CandidateSidebar.tsx` | All-steps left sidebar: step message + illustration with chips + features/progress |
| `candidate-reg/CandidateFormPanel.tsx` | Right form panel: title + ProgressStepper + step switcher (Step1–4) |
| `candidate-reg/StepActions.tsx` | Back + Save & Continue buttons shared across all steps |
| `candidate-reg/sections/SidebarFeatures.tsx` | Step-1 sidebar: card-style feature rows + trust badge |
| `candidate-reg/sections/SidebarProgress.tsx` | Steps 2-4 sidebar: progress bar, **horizontal** step list, tips, help |
| `candidate-reg/sections/EducationSection.tsx` | Education cards with add/edit/delete; wraps `AddEducationModal` |
| `candidate-reg/sections/CertificationsSection.tsx` | Certifications table with add/edit/delete; wraps `AddCertificationModal` |
| `candidate-reg/sections/PreferencesSection.tsx` | Preferences form (notice period, salary, roles, location, benefits) |
| `candidate-reg/sections/UploadResumeBanner.tsx` | Resume upload prompt banner shown at bottom of Step 2 |
| `candidate-reg/modals/AddEducationModal.tsx` | Add/Edit education — degree, institute, year, edu type, description, attachment |
| `candidate-reg/modals/AddExperienceModal.tsx` | Main experience form fields (company, dates, job title); delegates projects to `ProjectsSubForm` |
| `candidate-reg/modals/ProjectsSubForm.tsx` | Nested projects editor — project cards, skill tag input with search suggestions |
| `candidate-reg/modals/AddSkillModal.tsx` | Skill modal orchestrator — right panel (proficiency, experience, top-skill toggle) |
| `candidate-reg/modals/SkillLeftPanel.tsx` | Left panel of skill modal — search, popular skills grid, added skills list |
| `candidate-reg/modals/AddCertificationModal.tsx` | Add/Edit certification — name/institution/year/valid-till/upload |

### CandidateSidebar illustration pattern
Matches `RoleSelectionPage` exactly:
```tsx
<div className="relative rounded-2xl bg-[#EDE9FF] h-[160px] mb-3 shrink-0 overflow-hidden">
  <div className="absolute inset-x-6 top-6 bottom-0 rounded-full bg-[#C4B5FD]/30 z-0" />
  <Image src="/images/candidate.png" alt="Candidate" fill sizes="340px" className="object-contain object-bottom z-[1]" />
  {STEP_CHIPS[currentStep]}   {/* floating chips per step */}
</div>
```
Sidebar width is **fixed** `w-[300px] xl:w-[340px]` across all 4 steps (no jump).
Scrollbar hidden: `[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`

### CandidateRegistration orchestration
`CandidateRegistration` is a lean orchestrator — only state + two child components:
```tsx
<CandidateSidebar step={currentStep} />
<CandidateFormPanel currentStep={currentStep} data={data} onStepChange={setStep} onDataChange={setData} onSubmit={...} />
```
Variable naming convention: `s` → `currentStep` everywhere.

---

## Part 3 — Folder Structure

```
hiremind_web/
│
├── app/                                    # Next.js App Router
│   ├── (marketing)/                        # Route group — public marketing pages
│   │   ├── layout.tsx                      # Marketing layout (Header + Footer)
│   │   ├── page.tsx                        # / — home
│   │   ├── features/page.tsx               # /features
│   │   ├── ai-capabilities/page.tsx        # /ai-capabilities
│   │   ├── pricing/page.tsx                # /pricing
│   │   ├── faq/page.tsx                    # /faq
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── case-studies/page.tsx
│   │   ├── integrations/page.tsx
│   │   ├── book-demo/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── security/page.tsx
│   │   └── refunds/page.tsx
│   │
│   ├── (auth)/                             # Route group — unauthenticated flows
│   │   ├── layout.tsx                      # Auth layout (split-screen, no nav)
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── otp/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   │
│   ├── (app)/                              # Route group — authenticated app shell
│   │   ├── layout.tsx                      # App shell (sidebar + topbar + providers)
│   │   ├── dashboard/page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx                    # /jobs — listing
│   │   │   ├── new/page.tsx                # /jobs/new — create
│   │   │   └── [id]/
│   │   │       ├── page.tsx                # /jobs/:id — detail
│   │   │       ├── edit/page.tsx
│   │   │       └── applications/page.tsx
│   │   ├── candidates/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── recruiters/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/page.tsx
│   │   │   └── teams/page.tsx
│   │   ├── company/
│   │   │   ├── page.tsx
│   │   │   ├── onboarding/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── edit/page.tsx
│   │   ├── notifications/page.tsx
│   │   └── settings/
│   │       ├── page.tsx
│   │       ├── security/page.tsx
│   │       ├── notifications/page.tsx
│   │       └── billing/page.tsx
│   │
│   ├── api/                                # BFF — thin proxies to real backend
│   │   ├── auth/[...nextauth]/route.ts     # NextAuth handler
│   │   ├── jobs/
│   │   │   ├── route.ts                    # GET /api/jobs, POST /api/jobs
│   │   │   └── [id]/route.ts
│   │   ├── candidates/route.ts
│   │   ├── recruiters/route.ts
│   │   ├── company/route.ts
│   │   ├── notifications/route.ts
│   │   └── upload/route.ts
│   │
│   ├── layout.tsx                          # Root layout (html, body, fonts, providers)
│   ├── globals.css                         # Tailwind v4 + design tokens (do not modify tokens)
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/                             # Shared, domain-agnostic components
│   ├── ui/                                 # Primitive / headless UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Textarea.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Modal.tsx
│   │   ├── Sheet.tsx                       # Slide-over drawer
│   │   ├── Tooltip.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   ├── Toast.tsx
│   │   ├── Table.tsx
│   │   ├── Pagination.tsx
│   │   ├── Tabs.tsx
│   │   ├── Card.tsx
│   │   └── index.ts                        # Barrel export
│   │
│   ├── layout/                             # App-shell layout components
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Topbar.tsx
│   │   ├── MobileNav.tsx
│   │   ├── NotificationBell.tsx
│   │   └── UserMenu.tsx
│   │
│   ├── marketing/                          # Marketing-only shared components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CTABanner.tsx
│   │   └── BrandMark.tsx
│   │
│   └── providers/                          # React tree providers
│       ├── AppProviders.tsx                # Composes all providers in order
│       ├── QueryProvider.tsx               # React Query client + DevTools
│       ├── AuthProvider.tsx                # NextAuth SessionProvider
│       └── ToastProvider.tsx               # Sonner Toaster
│
├── modules/                                # Feature modules — all domain logic lives here
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── OtpForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ResetPasswordForm.tsx
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useSignup.ts
│   │   │   └── useOtp.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── schemas/
│   │   │   ├── login.schema.ts
│   │   │   └── signup.schema.ts
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── jobs/
│   │   ├── components/
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobList.tsx
│   │   │   ├── JobDetail.tsx
│   │   │   ├── JobForm.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   ├── ApplicationCard.tsx
│   │   │   ├── ApplicationList.tsx
│   │   │   └── AIMatchScore.tsx
│   │   ├── hooks/
│   │   │   ├── useJobs.ts
│   │   │   ├── useJob.ts
│   │   │   ├── useCreateJob.ts
│   │   │   ├── useUpdateJob.ts
│   │   │   └── useApplications.ts
│   │   ├── services/
│   │   │   ├── jobs.service.ts
│   │   │   └── applications.service.ts
│   │   ├── store/
│   │   │   └── jobs.slice.ts               # Zustand slice: filters, selectedJobId
│   │   ├── schemas/
│   │   │   └── job.schema.ts
│   │   └── types/
│   │       └── jobs.types.ts
│   │
│   ├── candidates/
│   │   ├── components/
│   │   │   ├── CandidateCard.tsx
│   │   │   ├── CandidateList.tsx
│   │   │   ├── CandidateProfile.tsx
│   │   │   ├── CandidateSearchBar.tsx
│   │   │   ├── ResumeUploader.tsx
│   │   │   └── SkillBadge.tsx
│   │   ├── hooks/
│   │   │   ├── useCandidates.ts
│   │   │   ├── useCandidate.ts
│   │   │   └── useResumeUpload.ts
│   │   ├── services/
│   │   │   └── candidates.service.ts
│   │   ├── schemas/
│   │   │   └── candidate.schema.ts
│   │   └── types/
│   │       └── candidates.types.ts
│   │
│   ├── recruiters/
│   │   ├── components/
│   │   │   ├── RecruiterCard.tsx
│   │   │   ├── RecruiterProfile.tsx
│   │   │   ├── TeamList.tsx
│   │   │   └── InviteMember.tsx
│   │   ├── hooks/
│   │   │   ├── useRecruiters.ts
│   │   │   └── useTeam.ts
│   │   ├── services/
│   │   │   └── recruiters.service.ts
│   │   └── types/
│   │       └── recruiters.types.ts
│   │
│   ├── company/
│   │   ├── components/
│   │   │   ├── CompanyProfile.tsx
│   │   │   ├── CompanyForm.tsx
│   │   │   ├── CompanyOnboarding.tsx
│   │   │   └── LogoUploader.tsx
│   │   ├── hooks/
│   │   │   ├── useCompany.ts
│   │   │   └── useUpdateCompany.ts
│   │   ├── services/
│   │   │   └── company.service.ts
│   │   └── types/
│   │       └── company.types.ts
│   │
│   ├── user/
│   │   ├── components/
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── EditProfileForm.tsx
│   │   │   ├── ProfilePhoto.tsx
│   │   │   └── AccountSwitcher.tsx
│   │   ├── hooks/
│   │   │   ├── useUserProfile.ts
│   │   │   └── useUpdateProfile.ts
│   │   ├── services/
│   │   │   └── user.service.ts
│   │   ├── store/
│   │   │   └── user.slice.ts
│   │   └── types/
│   │       └── user.types.ts
│   │
│   ├── notifications/
│   │   ├── components/
│   │   │   ├── NotificationItem.tsx
│   │   │   ├── NotificationList.tsx
│   │   │   └── NotificationPanel.tsx
│   │   ├── hooks/
│   │   │   ├── useNotifications.ts
│   │   │   └── useWebSocket.ts
│   │   ├── services/
│   │   │   └── notifications.service.ts
│   │   ├── store/
│   │   │   └── notifications.slice.ts      # Zustand: unread count, live list
│   │   └── types/
│   │       └── notifications.types.ts
│   │
│   └── settings/
│       ├── components/
│       │   ├── AccountSettings.tsx
│       │   ├── SecuritySettings.tsx
│       │   ├── NotificationSettings.tsx
│       │   ├── ChangePasswordForm.tsx
│       │   ├── DeleteAccountDialog.tsx
│       │   └── BillingSettings.tsx
│       ├── hooks/
│       │   ├── useSettings.ts
│       │   └── useChangePassword.ts
│       ├── services/
│       │   └── settings.service.ts
│       └── types/
│           └── settings.types.ts
│
├── lib/                                    # Infrastructure — no domain logic
│   ├── api/
│   │   ├── client.ts                       # Axios instance + interceptors + token refresh queue
│   │   ├── server-client.ts                # fetch wrapper for Server Components / Server Actions
│   │   ├── query-keys.ts                   # Centralized React Query key factory
│   │   └── types.ts                        # ApiResponse<T>, PaginatedResponse<T>, ApiError
│   ├── auth/
│   │   ├── next-auth.config.ts             # NextAuth providers + JWT/session callbacks
│   │   └── session.ts                      # Typed auth() helper for Server Components
│   ├── store/
│   │   └── index.ts                        # Zustand root store (composes module slices)
│   ├── utils/
│   │   ├── cn.ts                           # clsx + tailwind-merge
│   │   ├── format.ts                       # date, currency, number formatters
│   │   └── error.ts                        # Normalize API errors → ApiError
│   └── constants/
│       ├── routes.ts                       # Typed ROUTES object
│       ├── roles.ts                        # UserRole type + ROLE_PERMISSIONS map
│       └── query-stale-times.ts
│
├── types/
│   └── next-auth.d.ts                      # NextAuth type augmentation (accessToken, role)
│
├── docs/
│   └── architecture.md                     # This file
│
├── middleware.ts                            # Edge middleware — route protection + RBAC
├── next.config.ts                          # No output:"export"; image domains + security headers
├── tsconfig.json                           # Unchanged — strict mode, @/* alias
├── postcss.config.mjs                      # Unchanged
├── .env.local                              # Secrets (never committed)
└── .env.example                            # Env var template
```

---

## Part 4 — Key Architectural Decisions & Best Practices

### 4.1 Route Protection via Middleware

`middleware.ts` runs at the Edge before any React rendering. Three cases handled:
- Authenticated user hits `/login` → redirect to `/dashboard`
- Unauthenticated user hits `/jobs` → redirect to `/login?callbackUrl=%2Fjobs`
- Authenticated user without required role → redirect to `/403`

```typescript
// middleware.ts (shape)
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;
  // guard logic using ROUTES and ROLE_PERMISSIONS constants
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
```

### 4.2 Authentication — NextAuth v5 (Auth.js)

- `CredentialsProvider` calls backend `/auth/login`, returns user + tokens
- `jwt` callback stores `accessToken`, `refreshToken`, `expiresAt`, `role`
- `jwt` callback silently refreshes access token when expired; on failure sets `error: "RefreshAccessTokenError"` → forces sign-out
- `session` callback exposes `accessToken` and `role` to the client
- Client Components: `useSession()` — Server Components: `auth()` directly

### 4.3 API Layer — Axios Client + BFF

**Client-side (`lib/api/client.ts`):**
- Single Axios instance; `baseURL` points to `/api/` BFF routes (not the real backend)
- Request interceptor: reads NextAuth session, injects `Authorization: Bearer`
- Response interceptor: queues concurrent requests while token refreshes; on permanent 401 calls `signOut()`

**Server-side (`lib/api/server-client.ts`):**
- Plain `fetch` wrapper for Server Components and API Routes
- Reads session via `auth()`, sets Authorization header
- Real backend URL in `API_BASE_URL` env var (no `NEXT_PUBLIC_` — server only)

**BFF routes (`app/api/`):**
- Validate session → forward to backend → return normalized response
- Real backend URL is never exposed to the browser

### 4.4 State Management

| State type | Tool | Example |
|---|---|---|
| API data (jobs, profiles, etc.) | React Query | `useJobs()`, `useCompany()` |
| Mutation status | React Query `useMutation` | `useCreateJob()` |
| Active UI filters | Zustand | `jobFilters`, `setJobFilters` |
| Sidebar / nav state | Zustand | `sidebarCollapsed` |
| Real-time notification count | Zustand (updated by WebSocket) | `unreadCount` |
| Auth identity | NextAuth session | `useSession()` / `auth()` |
| Form input values | react-hook-form (local) | — |
| Modal open/close | `useState` (local) | — |

Zustand slices are co-located with their module (`modules/jobs/store/jobs.slice.ts`) and composed into one root store in `lib/store/index.ts`. Only user preferences are persisted via `zustand/middleware/persist`.

### 4.5 Component Strategy

- **Server Components** (default): layouts, page wrappers, data-loading shells, static sections
- **Client Components** (`"use client"`): forms, interactive UI, components using React Query or Zustand
- **`components/ui/`**: primitive components — accept `className` (merged via `cn()`), forward `ref`, no domain logic, named exports only
- **`modules/[module]/components/`**: domain components — collocated with hooks and services
- **Icons**: `lucide-react` exclusively; no inline SVGs for branding — use `BrandLogo` / `BrandLogoImg`

### 4.6 Module Isolation Rule

A module may only import from:
- Its own `modules/[module]/` subtree
- `components/ui/` (primitives)
- `lib/` (infrastructure)
- Another module's `index.ts` barrel export only

Modules **never** reach into another module's internal files. This makes each module independently replaceable.

### 4.7 Forms — react-hook-form + Zod

```typescript
// Standard form pattern
const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
type FormData = z.infer<typeof schema>;

const form = useForm<FormData>({ resolver: zodResolver(schema) });
const { mutate } = useMutation({
  mutationFn: authService.login,
  onError: (e: ApiError) => toast.error(e.message),
});
```

Zod schemas live in `modules/[module]/schemas/`. Types are inferred from schemas — no duplicate type definitions.

### 4.8 Coding Standards

**File naming:**

| Artifact | Convention | Example |
|---|---|---|
| React components | `PascalCase.tsx` | `JobCard.tsx` |
| Hooks | `useCamelCase.ts` | `useJobs.ts` |
| Services | `camelCase.service.ts` | `jobs.service.ts` |
| Zustand slices | `camelCase.slice.ts` | `jobs.slice.ts` |
| Zod schemas | `camelCase.schema.ts` | `job.schema.ts` |
| Type files | `camelCase.types.ts` | `jobs.types.ts` |
| Next.js files | lowercase | `page.tsx`, `layout.tsx`, `loading.tsx` |

**Import order (enforced by ESLint):**
1. React
2. Next.js (`next/link`, `next/navigation`)
3. Third-party libraries
4. Internal: `@/lib/`
5. Internal: `@/components/`
6. Internal: `@/modules/`
7. Relative (same module)
8. Types (`import type`)

**TypeScript naming:**

| Pattern | Convention | Example |
|---|---|---|
| Interfaces | PascalCase, no `I` prefix | `Job`, `ApiError` |
| Type aliases | PascalCase | `JobStatus`, `UserRole` |
| Zod schemas | camelCase + Schema suffix | `loginSchema` |
| Inferred types | PascalCase from schema | `type LoginFormData = z.infer<typeof loginSchema>` |
| Generic API types | Parameterized | `PaginatedResponse<T>`, `ApiResponse<T>` |

### 4.9 Role-Based Access Control

Three roles, enforced in `middleware.ts` using `lib/constants/roles.ts`:

| Role | Access |
|---|---|
| `candidate` | dashboard, jobs, profile, notifications, settings |
| `recruiter` | All candidate routes + candidates, company, recruiters |
| `admin` | All routes including billing and permissions |

```typescript
// lib/constants/roles.ts (shape)
export type UserRole = "candidate" | "recruiter" | "admin";

export const ROLE_PERMISSIONS: Record<string, UserRole[]> = {
  "/candidates": ["recruiter", "admin"],
  "/recruiters": ["recruiter", "admin"],
  "/company":    ["recruiter", "admin"],
  "/settings/billing": ["admin"],
};
```

### 4.10 Real-Time Notifications — WebSocket (STOMP)

`useWebSocket()` in `modules/notifications/hooks/` connects once on session establishment and writes incoming messages to the Zustand notifications slice. Called once from `app/(app)/layout.tsx` — never from individual pages.

### 4.11 Adding a New Module (Scalability)

Touching exactly these locations — nothing else:
1. Create `modules/[name]/` (components, hooks, services, schemas, types)
2. Create `app/(app)/[name]/page.tsx`
3. Add to `lib/constants/routes.ts`
4. Add to `lib/constants/roles.ts`
5. Create `app/api/[name]/route.ts` (BFF proxy)
6. Add nav item to `components/layout/Sidebar.tsx`

### 4.12 Marketing Pages Migration

Existing pages move from `app/` → `app/(marketing)/`. Route groups are URL-transparent:

| Current file | New location | URL (unchanged) |
|---|---|---|
| `app/page.tsx` | `app/(marketing)/page.tsx` | `/` |
| `app/features/page.tsx` | `app/(marketing)/features/page.tsx` | `/features` |
| `app/ai-capabilities/page.tsx` | `app/(marketing)/ai-capabilities/page.tsx` | `/ai-capabilities` |
| `app/pricing/page.tsx` | `app/(marketing)/pricing/page.tsx` | `/pricing` |
| `app/faq/page.tsx` | `app/(marketing)/faq/page.tsx` | `/faq` |

Existing components (`Header.tsx`, `Footer.tsx`, `CTABanner.tsx`, `BrandMark.tsx`, `BrandLogo.tsx`) live in `components/marketing/`. Import from `@/components/marketing/BrandLogo` — the old `BrandMark` SVG is no longer used for headers.

Root `app/layout.tsx` becomes minimal — only `html`, `body`, font links, `<AppProviders>`. Marketing Header + Footer move into `app/(marketing)/layout.tsx`.

### 4.13 Config Changes

Remove `output: "export"` from `next.config.ts` (blocks API routes and middleware). Add:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.hiremind.io" }],
  },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ],
    }];
  },
};
```

### 4.14 Environment Variables

`.env.local` (never committed — gitignored):
```bash
# Backend service URLs — server-side only (no NEXT_PUBLIC_ prefix).
# Use host.docker.internal when Next.js runs inside devcontainer (bridge network)
# and backends run with host network mode.
USERS_API_URL=http://host.docker.internal:5001/user-service
CANDIDATE_API_URL=http://host.docker.internal:5002/candidate-service
```

> **DevContainer networking note:** The Next.js dev server runs inside the `vsc-hiremind_web` devcontainer (bridge network). Backend services run in separate Maven containers with `--network host`. Inside Docker, `localhost` resolves to the container itself — use `host.docker.internal` to reach the host (and through it, host-networked backends). Restart `npm run dev` after any `.env.local` change.

Future / production additions:
```bash
# Server-only
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Client-visible (if ever needed)
NEXT_PUBLIC_WS_URL=wss://api.hiremind.io
```

### 4.15 API Proxy via Next.js Rewrites (CORS solution)

Browser calls never hit the backend directly. All API traffic goes through Next.js server-side rewrites:

```
Browser → /api/users/...     → Next.js rewrite → host.docker.internal:5001/user-service/...
Browser → /api/candidate/... → Next.js rewrite → host.docker.internal:5002/candidate-service/...
```

Config in `next.config.ts`:
```ts
async rewrites() {
  const usersApi     = process.env.USERS_API_URL     ?? "http://localhost:5001/user-service";
  const candidateApi = process.env.CANDIDATE_API_URL ?? "http://localhost:5002/candidate-service";
  return [
    { source: "/api/users/:path*",     destination: `${usersApi}/:path*`     },
    { source: "/api/candidate/:path*", destination: `${candidateApi}/:path*` },
  ];
}
```

Client-side base URLs (`lib/api/config.ts`):
```ts
export const API = {
  USERS:     "/api/users",      // always proxy — never NEXT_PUBLIC_ override
  CANDIDATE: "/api/candidate",
};
```

Token helpers also in `lib/api/config.ts`: `getAccessToken()`, `setAccessToken()`, `clearAuth()` — use `localStorage`.

> **Do NOT** add `NEXT_PUBLIC_USERS_API_URL` or `NEXT_PUBLIC_CANDIDATE_API_URL` to `.env.local`. Those would bypass the proxy and cause CORS errors in the browser.

### 4.16 Backend Service Ports

| Service | Port | Context path | Base URL (from host) |
|---|---|---|---|
| users_api | 5001 | `/user-service` | `http://localhost:5001/user-service` |
| candidate_api | 5002 | `/candidate-service` | `http://localhost:5002/candidate-service` |

Both services share the same JWT secret. The `candidate_api` validates tokens issued by `users_api` — JWT issuer in both `application.properties` must be `hiremind-users-api`.

### 4.17 Auth Flow — Login & Registration

#### Login (`/login`)
`LoginPage.tsx` calls `loginUser()` from `modules/auth/services/auth.service.ts`:
- `POST /api/users/api/v1/auth/login` with `{ accountType, email, password, rememberMe }`
- Role mapping: `"candidate"` → `"CANDIDATE"`, `"recruiter"` → `"RECRUITMENT_COMPANY"`
- On success: stores `accessToken`, `refreshToken`, `userId` in `localStorage`
- Redirects to `/dashboard`
- Switching role tabs clears all field errors and submit error

#### Candidate Registration — Step 1 (with rollback)
**Form fields:** full name, email (+ OTP), phone (+ OTP), password, job title, current location, **Professional Summary** textarea (2000-char limit). The "Where did you hear about us?" select, OR divider, and Google/Apple OAuth buttons have been removed.

On "Continue" in `Step1BasicInfo`:
1. **`registerCandidateUser(data)`** — `POST /api/users/api/v1/auth/register` → stores tokens; `source: null` (hear-about-us removed)
2. **`updateCandidateBasicInfo(data)`** — `PUT /api/candidate/api/v1/candidate/profile/basic-info`; includes `professionalSummary`
3. If step 2 fails → **`deleteCurrentUser()`** — `DELETE /api/users/api/v1/users/me` (rollback)

Password validation matches backend `@StrongPassword`: min 8 chars + uppercase + lowercase + digit + special character.

Service files:
- `modules/auth/services/auth.service.ts` — `registerCandidateUser()`, `loginUser()`, `deleteCurrentUser()`
- `modules/auth/services/candidate.service.ts` — `updateCandidateBasicInfo()`

### 4.18 Backend — users_api Conventions

- **Constructor injection**: all `@Service`, `@Component`, `@RestController` classes use `@RequiredArgsConstructor` (Lombok). No manual constructors.
- **`LoginStatus` enum**: `SUCCESS`, `FAILED`, `REGISTERED`
- **Login history propagation**:
  - `saveLoginHistory()` — `Propagation.REQUIRES_NEW` — for login attempts (persists even if parent tx rolls back)
  - `saveRegistrationHistory()` — `Propagation.REQUIRED` — for registration (joins parent tx so FK to `users` is satisfied before commit)
- **`DELETE /api/v1/users/me`** — deletes the authenticated user's account; used as a registration rollback when `candidate_api` fails
- **`email_verified` / `phone_verified`** — explicitly initialised to `false` in `UserAccount` entity; DB column also has `DEFAULT FALSE`
- **`user_sessions`** — `ON DELETE CASCADE` from `users`; deleted automatically on user rollback
- **`user_login_history`** — `ON DELETE SET NULL`; row kept as audit trail, `user_id` set to null

### 4.19 Backend — candidate_api DB Schema

**Table names** (as of current schema):

| Table | Notes |
|---|---|
| `candidate` | Main profile — renamed from `candidate_profiles` |
| `candidate_educations` | FK column: `candidate_id`; includes `location`, `year_of_passing` (VARCHAR), `grade`, `education_type`, `description` |
| `candidate_work_experiences` | FK column: `candidate_id` |
| `candidate_projects` | FK column: `work_experience_id` |
| `candidate_skills` | FK columns: `candidate_id`, `skill_id` |
| `candidate_certifications` | FK column: `candidate_id` |
| `candidate_preferences` | FK column: `candidate_id` |
| `skills` | Skill catalogue (seeded in V2) |
| `degree_courses` | Master: degree / course options (seeded in V3, 27 rows) |
| `education_types` | Master: education type options (seeded in V3 — Full Time, Part Time, Distance Learning, Online) |

- All FK columns use `candidate_id` — not `candidate_profile_id`
- `year_of_passing` is `VARCHAR(10)` — stored as text, not integer
- All entities use `@RequiredArgsConstructor` (Lombok)
- JWT issuer must be `hiremind-users-api` (matches tokens issued by `users_api`)

**Migration files:**
| File | Contents |
|---|---|
| `V1__candidate_service_initial_schema.sql` | All core tables including `candidate_educations` with full columns |
| `V2__seed_popular_skills.sql` | Skills master data |
| `V3__education_master_data.sql` | `degree_courses` + `education_types` tables + seed data |
| `V4__add_resume_file_key.sql` | Adds `resume_file_key VARCHAR(500)` to `candidate` |
| `V5__add_education_attachments.sql` | Adds `attachment_file_keys TEXT` to `candidate_educations` |
| `V6__add_professional_summary.sql` | Adds `professional_summary TEXT` to `candidate` |
| `V7__add_profile_picture_key.sql` | Adds `profile_picture_key VARCHAR(500)` to `candidate` |

### 4.20 Backend — candidate_api Master Data Endpoints

Public endpoints (no auth token required):

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/v1/candidate/master/degrees` | `[{ name, category }]` — all active degrees sorted by `sort_order` |
| `GET` | `/api/v1/candidate/master/education-types` | `[{ name }]` — all active education types sorted by `sort_order` |

These are permitted in `SecurityConfig` under `/api/v1/candidate/master/**`.

### 4.21 Frontend — candidate.service.ts API Functions

All authenticated calls use `authedFetch()` (injects `Authorization: Bearer <token>`). On `401`/`403`, redirects to `/login`.

#### Basic Info & Master Data
| Function | Method | Endpoint |
|---|---|---|
| `updateCandidateBasicInfo()` | PUT | `/api/v1/candidate/profile/basic-info` — body includes `professionalSummary` |
| `fetchDegreeCourses()` | GET | `/api/v1/candidate/master/degrees` |
| `fetchEducationTypes()` | GET | `/api/v1/candidate/master/education-types` |
| `fetchSkills(q?)` | GET | `/api/v1/candidate/skills?q=` |
| `fetchCandidateProfile()` | GET | `/api/candidate/profile` — maps `raw.profilePictureUrl → profilePicture`, `raw.currentRole → jobTitle` |
| `fetchFullProfile()` | GET | `/api/candidate/profile` — returns `FullProfile` including `profilePictureUrl: string \| null` (presigned S3 URL) |
| `uploadProfilePicture(file)` | POST | `/api/v1/candidate/profile/picture/upload` — returns `profilePictureKey` |

#### Education
| Function | Method | Endpoint |
|---|---|---|
| `addEducation(payload)` | POST | `/api/v1/candidate/profile/educations` |
| `updateEducation(id, payload)` | PUT | `/api/v1/candidate/profile/educations/:id` |
| `deleteEducation(id)` | DELETE | `/api/v1/candidate/profile/educations/:id` |

`EducationPayload`: `degree`*, `institution`*, `location`*, `specialization`, `yearOfPassing` (string), `grade`, `educationType`, `description`.

#### Work Experience
| Function | Method | Endpoint |
|---|---|---|
| `addWorkExperience(payload)` | POST | `/api/v1/candidate/profile/work-experiences` |
| `updateWorkExperience(id, payload)` | PUT | `/api/v1/candidate/profile/work-experiences/:id` |
| `deleteWorkExperience(id)` | DELETE | `/api/v1/candidate/profile/work-experiences/:id` |

`WorkExperiencePayload`: `companyName`*, `jobTitle`*, `employmentType`* (enum: `FULL_TIME`/`PART_TIME`/`CONTRACT`/`INTERNSHIP`/`FREELANCE`), `startDate`* (`YYYY-MM-DD`), `endDate` (`YYYY-MM-DD` or null), `currentlyWorking`*, `location`, `noticePeriod`, `projects[]`.

`ProjectPayload`: `projectName`*, `roleName`, `description`, `startDate`, `endDate`, `technologiesUsed` (comma-separated string).

Date conversion: form `MM/YYYY` → `YYYY-MM-01`.

#### Skills
| Function | Method | Endpoint |
|---|---|---|
| `addCandidateSkill(payload)` | POST | `/api/v1/candidate/profile/skills` |
| `updateCandidateSkill(id, payload)` | PUT | `/api/v1/candidate/profile/skills/:id` |
| `deleteCandidateSkill(id)` | DELETE | `/api/v1/candidate/profile/skills/:id` |

`SkillPayload`: `skillName`*, `proficiencyLevel`* (`BEGINNER`/`INTERMEDIATE`/`ADVANCED`/`EXPERT`/`MASTER`), `experienceYears` (BigDecimal), `lastUsed` (`YYYY-MM-DD`), `topSkill`*, `additionalDetails`.

`buildSkillPayload(skill: Skill): SkillPayload` — helper that converts:
- `proficiency` label → backend enum via `PROFICIENCY_MAP`
- `lastUsed` "May 2024" → `"2024-05-01"`
- `experienceValue` + `experienceUnit` → decimal `experienceYears` (months ÷ 12)
- The `Skill` interface no longer has a `yearsOfExperience` field; the years-of-experience slider has been removed from `AddSkillModal`

#### Certifications
| Function | Method | Endpoint |
|---|---|---|
| `addCertification(payload)` | POST | `/api/v1/candidate/profile/certifications` |
| `updateCertification(id, payload)` | PUT | `/api/v1/candidate/profile/certifications/:id` |
| `deleteCertification(id)` | DELETE | `/api/v1/candidate/profile/certifications/:id` |

`CertificationPayload`: `certificationName`*, `issuingInstitution`*, `credentialId`, `certificateUrl`, `passedYear` (Integer), `validTill` (`YYYY-MM-DD` — omit if `doesNotExpire: true`), `doesNotExpire`*, `displayOnProfile`*, `description`.

#### Preferences
| Function | Method | Endpoint |
|---|---|---|
| `savePreferences(payload)` | PUT | `/api/v1/candidate/profile/preferences` |

`buildPreferencesPayload(data)` converts `PreferencesData` → `PreferencesPayload`:
- `jobRolePreferences` → `rolePreferences`
- `employmentTypes` enum names passed through directly to `preferredEmploymentTypes` (stored as enum names, no re-mapping needed)
- `preferredLocations: string[]` joined with `", "` → single `preferredLocation` string for backend
- `additionalNotes` → `additionalPreferences`

`PreferencesPayload`: `noticePeriod`, `expectedSalary`, `salaryType`, `preferredLocation` (comma-joined string), `openToRelocate`*, `rolePreferences[]`, `preferredEmploymentTypes[]` (backend `EmploymentType` enums), `benefits[]`, `additionalPreferences`.

`PreferencesData.preferredLocations` is `string[]` — multi-select checkboxes from `LOCATION_OPTIONS`. `EditProfilePage` splits the stored `preferredLocation` string back to `string[]` on load.

### 4.22 Backend — Profile Picture Presigned URL

`CandidateProfileService` generates a presigned URL on every profile fetch:

```java
private String buildPresignedUrl(String key) {
    if (key == null) return null;
    try {
        return s3StorageService.createPresignedReadUrl(key, Duration.ofHours(1)).toString();
    } catch (Exception e) {
        return null; // NoopS3StorageService in local dev — returns null gracefully
    }
}
```

`CandidateProfileResponse` includes `String profilePictureUrl` (after `profilePictureKey`). Both fields are always present; `profilePictureUrl` is null when S3 is not configured or the key is null.

Frontend uses `profilePictureUrl` directly as `<img src>` — no separate download endpoint needed for profile pictures.

### 4.23 View Profile & Edit Profile — Layout & UX

**Layout:** both pages are **2-column** (left panel + centre). `ProfileRightPanel` is not rendered.

**`(app-wide)/layout.tsx`** padding: `p-2` on `<main>` (was `px-6 py-6` on an inner div).

**ProfileLeftPanel nav** (4 items only): Overview, Experience, Education, Skills & Certifications. On `/profile` these are scroll buttons backed by `IntersectionObserver`; on other paths they are route `<Link>`s.

**Section highlighting:** clicking a nav item calls `onSectionClick(sectionId)` → `ProfilePage` sets `highlightedSection` (cleared after 1.5 s). The matching section's `<h2>` and header row receive `bg-brand-50` + `text-brand-600` via `transition-colors duration-500`.

**ProfessionalSummary** in `ProfilePage` reads from `fullProfile.professionalSummary` — returns `null` (renders nothing) when the field is empty.

**Edit Profile tab card consistency** — all tab content uses `space-y-4` root + `card` wrappers:
- Basic Info: `card p-5` for all fields; Save outside
- Experience tab: `EducationSection` in `card`; experience `<section>` → `card p-5`
- Skills tab: skills block in `card p-5` (inner table uses `rounded-xl border`, not nested card); `CertificationsSection` in `card`
- Preferences tab: `PreferencesSection` in `card`; Save button no extra horizontal padding

### 4.24 JWT Security — Dev vs Production

| Setting | Dev value | Production value |
|---|---|---|
| `hiremind.security.jwt.access-token-minutes` | `1440` (24 h) | `15` (15 min) |
| `hiremind.security.jwt.refresh-token-days` | `30` | `30` |

JWT is issued by `users_api` and validated by `candidate_api`. Both must share the same `secret` and `issuer` (`hiremind-users-api`).

Spring Security's `JwtAuthenticationFilter` silently swallows `RuntimeException` (including expired-token errors) and clears the security context — resulting in a `403` response rather than `401`. The frontend handles both `401` and `403` by redirecting to `/login`. After changing `access-token-minutes`, **rebuild the users_api Docker container** and re-login.

### 4.23 Shared UI Patterns — candidate-reg

All shared primitives live in `candidate-reg/shared/` and are imported across steps, modals, and sections.

#### `shared/ui.tsx` — UI components
| Component | Description |
|---|---|
| `ConfirmDialog` | Fixed overlay modal: trash icon, label, "This action cannot be undone", Cancel + Delete buttons with inline spinner |
| `Tooltip` | `relative group/tip` wrapper; dark tooltip anchored `bottom-full`. Parent must NOT have `overflow-hidden` (clips upward-positioned tooltips) |
| `DotsIndicator` | Row of 5 dots; `filled` prop controls how many are brand-colored (1=Beginner → 5=Master) |
| `SectionHeader` | Section title + icon + "Add …" button row |
| `EmptyState` | Centered icon + message + hint for empty lists |
| `SelectField` | Label + native `<select>` with brand focus ring |

#### `shared/icons.tsx` — SVG icons (named exports, no `"use client"`)
All icon components: `PersonIcon`, `MailIcon`, `LockIcon`, `LocationIcon`, `GoogleIcon`, `AppleIcon`, `ArrowRightIcon`, `ArrowLeftIcon`, `ChevronDownIcon`, `ChevronIcon({ expanded })`, `EditIcon`, `TrashIcon`, `TrashSmIcon`, `PlusIcon`, `SpinnerIcon`, `CalendarIcon`, `CalendarIconSm`, `GradIcon`, `GradIconLg`, `BriefcaseIcon`, `BriefcaseIconLg`, `UploadIcon`, `UploadCloudIcon`, `SkillsIcon`, `SkillsIconLg`, `SkillIcon`, `CertIcon`, `CertIconLg`, `CertBadgeIcon`, `PrefsIcon`, `SearchIcon`, `InfoIcon`, `LinkIcon`, `GraduationCapIcon`

`GraduationCapIcon` — used in `AddEducationModal` header (matches `BriefcaseIcon` style in `AddExperienceModal`).

#### `shared/constants.ts` — data constants
`MONTHS`, `MONTHS_LONG`, `PAST_YEARS`, `FUTURE_YEARS`, `LAST_USED_OPTIONS`, `PROFICIENCY_LEVELS`, `PROFICIENCY_DOTS`, `POPULAR_SKILLS`, `POPULAR_SKILL_COLORS`, `EMPLOYMENT_TYPE_MAP`, `EMPLOYMENT_TYPES`, `NOTICE_OPTIONS`, `SALARY_OPTIONS`, `SALARY_TYPE`, `LOCATION_OPTIONS`, `BENEFIT_OPTIONS`, `HEAR_OPTIONS`

#### `shared/types.ts` — form interfaces + modal state types
`EducationFormData`, `ExperienceFormData`, `ProjectForm`, `CertificationFormData`, `PreferencesData`, `EduModalState`, `ConfirmState`

#### Import path convention
Files in `steps/`, `modals/`, `sections/` are one level deeper than root:
- Services/types: `../../../services/` and `../../../types/`
- Shared utilities: `../shared/icons`, `../shared/ui`, `../shared/constants`, `../shared/types`
- Cross-folder: steps import modals via `../modals/`, sections import modals via `../modals/`

### 4.15 Packages to Install

```bash
# Auth
next-auth@beta

# Server state
@tanstack/react-query @tanstack/react-query-devtools

# Client state
zustand

# Forms + validation
react-hook-form @hookform/resolvers zod

# HTTP
axios

# UI utilities
clsx tailwind-merge lucide-react

# Toast + real-time
sonner @stomp/stompjs

# Dev tooling
eslint eslint-plugin-import @tanstack/eslint-plugin-query prettier
```

---

## Verification Checklist

- [ ] `npm run dev` — all marketing pages load at existing URLs with no broken imports
- [ ] `GET /api/health` returns `{ ok: true }` (confirms `output:"export"` is removed)
- [ ] `GET /dashboard` unauthenticated → redirects to `/login?callbackUrl=%2Fdashboard`
- [ ] Login → session established → redirect to `/dashboard`
- [ ] `GET /candidates` as `candidate`-role user → redirected to `/403`
- [ ] Create job via form → React Query mutation fires, list invalidates, toast confirms
- [ ] App shell mounts → WebSocket connects → notification bell reflects real-time count
