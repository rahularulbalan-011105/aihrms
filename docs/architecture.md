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

```bash
# .env.example

# Server-only — never exposed to browser
API_BASE_URL=https://api.hiremind.io
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<openssl rand -base64 32>
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Client-visible
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_WS_URL=wss://api.hiremind.io
```

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
