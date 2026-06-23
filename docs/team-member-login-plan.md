# Design Plan — Login Provision for Team Members

Status: **Proposal (no code yet)** · Date: 2026-06-23

## 1. Problem

Invited team members cannot log in. Authentication runs through `users_api`
(`POST /api/users/auth/login`), which validates against the `user_accounts`
table. A team member today is **only a row in `company_api.team_members`** — not
a user account. The generated temp password is also deliberately never stored.

So "provision login" fundamentally means: **create a `users_api` account for the
member**, and (to make login *useful*) **let that account act within the parent
company's data.**

## 2. Current facts (verified in code)

- **Login** — `LoginRequest { accountType, email, password }` → checks
  `passwordHash`, `status == ACTIVE`, `isActive`, and `accountType` match →
  returns `{ userId, accountType, accessToken, refreshToken }`.
  (`AuthService.login`, `users_api`)
- **JWT claims** — `subject = userId`, `email`, `accountType`,
  `roles = ["ROLE_<accountType>"]`. **No company/org claim.** Signed by
  `core_module JwtTokenService.createAccessToken(userId, email, accountType, roles)`.
- **`AccountType`** (core_module) = `CANDIDATE`, `RECRUITMENT_COMPANY` only.
- **company_api ownership** — `CurrentUser(id, email, accountType, roles)` is
  parsed from the JWT; **every** domain (clients, jobs, team, applications,
  recommendations) is scoped by `user_id` = the creating recruiter, and the
  company is resolved via `companyRepository.findByUserId(userId)`.
- **team_members** — `status` ∈ {INVITED, ACTIVE, INACTIVE}; no `user_id` link to
  a login account; temp password lives only in the Add-form UI.
- **Cross-service pattern exists** — `company_api.CandidateClient` (a `RestClient`
  that forwards the caller's bearer token). A `UsersClient` would mirror it.
- **Frontend login routing** — role selector (`candidate` | `recruiter`);
  recruiter → `fetchCompanyProfile()` → `/company/dashboard`.

## 3. The core fork

A team member who logs in gets **their own** `userId`. Because company_api scopes
by `user_id`, they would land in an **empty company shell** — none of the parent
company's clients/jobs/team — unless ownership is re-keyed to a shared
`company_id`. That re-keying is the RBAC work the project explicitly deferred.

## 4. Recommended approach — staged

### Stage 1 — Provisioning + account linkage  *(contained; this PR)*
Make login *possible* and lay the FK groundwork.

1. **`team_members.user_id_account`** (new nullable column, migration `V9`) — the
   `users_api` account id created for the member. (Distinct from the existing
   `user_id`, which is the *inviting recruiter*.)
2. **Create the account at invite** — `TeamMemberService.createMember` calls a new
   `UsersClient.register(...)` → `users_api POST /auth/register` with
   `accountType = RECRUITMENT_COMPANY` (see Decision B), the member's name/email,
   and a password (see Decision A). Store the returned `userId` on the row.
   - Non-fatal vs. fatal? → **fatal**: if the account can't be created, the invite
     should fail (otherwise the member silently can't log in). Wrap duplicate-email
     from users_api into the existing `EMAIL_EXISTS` business error.
3. **Member status** — set `ACTIVE` once the account exists (or keep `INVITED`
   until first login if we add activation — see Decision A).
4. **Delete** — `deleteMember` should also deactivate/delete the linked
   `users_api` account (add `UsersClient.deactivate(userId)` or a delete endpoint).

### Stage 2 — Company-scoped access  *(makes login useful; separate PR)*
A `resolveActingCompany(currentUser)` helper in company_api:
- If the user owns a company (`findByUserId`) → that company.
- Else if the user is a linked team member (`team_members.user_id_account = userId`)
  → that member's `company_id`.

Then switch the ownership guards/queries from `user_id` to `company_id`,
service by service (clients → jobs → team → applications). **This keeps the JWT
unchanged** — no new claim, no users_api change — which is the lowest-risk way to
get shared-company access.

### Stage 3 — Permission enforcement  *(optional, later)*
Enforce the member's stored `role` / `permissions` on specific actions
(e.g. Viewer = read-only). Out of scope for now.

## 5. Decisions needed before coding

- **A — Password / activation.**
  1. *Temp password + forced reset* — register the generated temp password, force a
     change on first login. Simplest; no email needed. (No "force reset" flag
     exists yet — would add one.)
  2. *Invite link* — create the account with no usable password; member sets it via
     an activation link. **Blocked**: no email delivery exists yet.
  3. *Admin-set password* — add a real password field to the Add form.
  → **Recommend #1** given no email infra.

- **B — Account type.**
  1. *Reuse `RECRUITMENT_COMPANY`* — members ride the existing company login/shell.
     Smallest change; relies on Stage 2 to scope their data.
  2. *New `COMPANY_MEMBER` AccountType* — cleaner separation, but touches the
     core enum, login role selector, JWT roles, and every `accountType` guard.
  → **Recommend #1** for now; revisit if RBAC grows.

- **C — Mechanism (deferred from the earlier question).**
  1. *company_api → users_api server-side* via `UsersClient`.
  2. *Frontend orchestrates* (register then create, like company registration).
  → **Recommend #1** — keeps the temp password server-side and the team-member
  create atomic.

- **D — Scope now.** Stage 1 only (login works, own shell), or Stage 1 + Stage 2
  (login + parent-company data)? Stage 2 is the larger, ownership-rewrite change.

## 6. Risk / impact

- Stage 1 is additive and low-risk (new column, one cross-service call).
- Stage 2 rewrites ownership filters across company_api — **high blast radius**;
  must be done carefully with the existing per-`user_id` guards and tested per
  service. Recommend landing Stage 1 first, then Stage 2 behind its own review.
- Cross-service coupling: company_api now depends on users_api for writes (today
  it only reads candidate_api). Need a base-url property + failure handling.

## 7. Out of scope

NextAuth v5 / token refresh (pending-work #5/#6), email/SMS invite delivery,
Roles & Permissions API, Activity Log.
