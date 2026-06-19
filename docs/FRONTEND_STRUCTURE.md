# Frontend Structure — Review Guide

> RokKru (`frontend/`) — folder layout, MVC layers, and page-to-hook mapping for code review.  
> Stack: **React 19 + Vite 8 + Tailwind CSS + react-router-dom 7**

---

## 1. MVC overview (aligned with backend)

The frontend mirrors `backend_rokkru/` Express MVC:

| MVC layer | Frontend folder | Backend equivalent | Responsibility |
|-----------|-----------------|--------------------|----------------|
| **Route** | `src/App.jsx` | `routes/v1/` | Map URL → screen |
| **View** | `src/pages/`, `src/components/` | JSON response (render) | JSX only — compose UI |
| **Controller** | `src/hooks/` | `controllers/` | State, effects, user actions |
| **Model** | `src/services/` | `models/` + Sequelize | HTTP calls to `/api/v1/…` |
| **Transform** | `src/utils/`, `src/lib/` | `utils/` | Pure mappers, filters (no React, no fetch) |
| **Middleware** | `hooks/auth/`, `ProtectedRoute` | `middleware/` | Auth, role guards |

### Data flow

```
Route (App.jsx)
  → Page (View)
  → Hook (Controller)
  → Service (Model) → api.js → /api/v1/…
  → Utils mapper → hook state
  → Components re-render
```

**Review rule:** `pages/` should **not** import `@/services/` directly. Use a hook in `hooks/` instead.

More detail: [MVC.md](./MVC.md) · Mentor conventions: [MENTOR_FRONTEND.md](./MENTOR_FRONTEND.md) · Backend: `backend_rokkru/docs/MENTOR_BACKEND.md`

---

## 2. Top-level tree

```
frontend/
├── docs/
│   ├── FRONTEND_STRUCTURE.md   ← this file (review)
│   ├── MVC.md                  ← MVC rules
│   └── MENTOR_FRONTEND.md      ← mentor conventions
├── public/
├── src/
│   ├── App.jsx                 # Routes + guards
│   ├── main.jsx                # Entry
│   ├── index.css               # Global styles, glass system
│   │
│   ├── pages/                  # View — route screens
│   ├── components/             # View — reusable UI
│   ├── hooks/                  # Controller
│   ├── services/               # Model — API
│   ├── utils/                  # Transform
│   ├── lib/                    # Transform + i18n + domain helpers
│   ├── constants/              # Tokens, routes, filter defaults
│   └── contexts/               # Global React context (content, quick view)
│
├── components.json             # shadcn/ui config
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 3. `src/pages/` — View (by role)

| Folder | Screens | Count |
|--------|---------|-------|
| `auth/` | Landing, Login, CreateAccount, ForgotPassword, AdminLogin | 5 |
| `onboarding/` | CompleteProfile, CompleteMentorProfile, ChooseCommunity | 3 |
| `student/` | Home, Schedule, MentorDetail, BookSession, Profile, … | 14 |
| `mentor/` | MentorHome, Analytics, EditProfile, MentorSchedule, … | 14 |
| `admin/` | AdminDashboard, UserManagement, PlatformCatalog, … | 14 |
| `community/` | CommunityDetail, CreateCommunity, CommunityCreatePost, … | 4 |
| `legal/` | Privacy, Terms, Help, Contact, … | 8 |
| root | `NotFound.jsx` | 1 |

**Naming:** PascalCase files (`MentorHome.jsx`). One default export per page.

---

## 4. `src/hooks/` — Controller (by domain)

```
hooks/
├── index.js              # Re-exports all domains
├── auth/                 # Session (AuthContext)
├── mentor/               # Mentor dashboards, profile, posts, schedules
├── student/              # Student bookings, profile, search
├── platform/             # Notifications, Stripe checkout
├── admin/                # Admin dashboard, catalog, users
├── forms/                # Reusable form state (booking, review, chat)
├── ui/                   # Modal, pagination, tabs, filters
└── useCommunities.js     # Community feed
```

### Mentor controllers (`hooks/mentor/`)

| Hook | Used by page(s) | Model service |
|------|-----------------|---------------|
| `useMentorDashboard` | `MentorHome.jsx` | `mentorService` |
| `useMentorAnalytics` | `Analytics.jsx` | `mentorService` |
| `useMentorSchedule` | `MentorSchedule.jsx` | `mentorService`, `mentorScheduleService` |
| `useMentorMyProfile` | `MentorMyProfile.jsx` | `mentorService` |
| `useMentorEditPost` | `MentorEditPost.jsx` | `mentorService` |
| `useMentorCreatePost` | `MentorCreatePost.jsx` | `mentorService`, `mentorScheduleService` |
| `useMentorDetail` | `MentorDetail.jsx`, `BookSession.jsx` | `mentorService` |
| `useMentors` | `Home.jsx`, `SearchResults.jsx` | `mentorService` |
| `useMentorFilters` | `Home.jsx`, `Schedule.jsx` | — (local + catalog) |
| `usePublishedSchedules` | `Schedule.jsx` | `mentorService` |
| `useMentorSubscription` | `MentorBilling.jsx`, `PaymentSuccess.jsx` | `subscriptionService` |
| `useSubscriptionPlans` | `MentorSubscription.jsx`, `MentorBilling.jsx` | `subscriptionService` |

### Student controllers (`hooks/student/`)

| Hook | Used by page(s) | Model service |
|------|-----------------|---------------|
| `useStudentBookings` | `StudentBookings.jsx` | `studentBookingService` |
| `useStudentProfile` | `Profile.jsx` | `mentorService` (provinces) |
| `useStudentEditProfile` | `StudentEditProfile.jsx` | `studentProfileService`, `authService` |
| `useSearchResults` | `SearchResults.jsx` | `mentorService` |
| `useSchedulePostDetail` | `SchedulePostDetail.jsx` | `mentorService` |
| `useBookSession` | `BookSession.jsx` | `studentBookingService` |
| `useSessionReview` | `SessionReview.jsx` | `studentReviewService` |

### Platform controllers (`hooks/platform/`)

| Hook | Used by page(s) | Model service |
|------|-----------------|---------------|
| `useNotificationInbox` | `Notifications.jsx` | `notificationService` |
| `usePaymentVerification` | `PaymentSuccess.jsx` | `subscriptionService` |
| `useMentorCheckout` | `MentorBilling.jsx` | `subscriptionService` |

### Admin controllers (`hooks/admin/`)

| Hook | Used by page(s) | Model service |
|------|-----------------|---------------|
| `usePlatformCatalog` | `PlatformCatalog.jsx` | `adminApi` |
| `useAdminUsers` | `UserManagement.jsx` | `adminApi` |
| `useAdminMentors` | `MentorManagement.jsx` | `adminApi` |
| `useAdminSessions` | `SessionManagement.jsx` | `adminApi` |
| `useDashboardStats` | `AdminDashboard.jsx` | `adminApi` |
| `useAdminOverview` | `SystemReports.jsx` | `adminApi` |
| … | … | … |

---

## 5. `src/services/` — Model (API layer)

```
services/
├── core/
│   ├── api.js            # fetch + cookies (all HTTP goes here)
│   ├── endpoints.js      # ENDPOINTS.mentors, .auth, .students, …
│   ├── apiErrors.js
│   └── client.js
├── mentors/
│   ├── mentorService.js       # Main mentor CRUD, posts, skills, portfolio
│   └── mentorScheduleService.js
├── students/
│   ├── studentProfileService.js
│   ├── studentBookingService.js
│   └── studentReviewService.js
├── auth/
│   └── authService.js
├── admin/
│   └── adminApi.js
├── platform/
│   ├── subscriptionService.js
│   ├── notificationService.js
│   └── platformContentService.js
├── users/
│   └── userProfileService.js
└── communities/
    └── communityService.js
```

**Rules for review:**

- All paths live in `services/core/endpoints.js` → `ENDPOINTS`
- Pages/hooks call service functions; services call `apiRequest()` only
- No React imports inside `services/`

---

## 6. `src/components/` — View (reusable)

```
components/
├── ui/                   # Primitives: Button, Input, Modal, Avatar, shadcn/
├── common/               # PageCard, DataTable, MentorCard, FilterBar, …
├── layout/               # MainLayout, AdminLayout, Navbar, ProtectedRoute
├── backgrounds/          # MeshNetwork, PolygonBackground (auth/landing)
├── admin/content/        # Legal/help editors (admin CMS)
├── mentor/               # Mentor-specific panels
└── index.js              # Barrel exports
```

### Shared page patterns (prefer these in new screens)

| Component | Purpose |
|-----------|---------|
| `PageAmbient` | Page background + glass scope |
| `PageScaffold` / `PageSection` | Title + content spacing |
| `PageCard` | Glass card container |
| `StatMetric` | Dashboard stat tile |
| `DataTable` | Table + pagination |
| `FilterBar` | Analytics/admin filters |

### Styling

- **Tailwind** utilities + `index.css` glass classes (`.glass-panel`, `.glass-panel-hover`)
- **Tokens:** `constants/ui/tokens.js`, `constants/ui/typography.js` → `TEXT.*`
- **Brand color:** `#c07888` (`primary-500`, `--primary`)
- **i18n fonts:** Plus Jakarta Sans (EN), Kantumruy Pro (KM)

---

## 7. `src/utils/` & `src/lib/` — Transform

| Area | Key files |
|------|-----------|
| Mentor mapping | `mentorMapper.js`, `mentorDetailUtils.js`, `mentorPostMapper.js` |
| Experience | `mentorExperienceUtils.js` (`splitExperienceByType`) |
| Analytics | `analyticsFilterUtils.js`, `analyticsExportUtils.js`, `mentorDashboardUtils.js` |
| Provinces | `provinceOptions.js` |
| API payload | `lib/mentorApiMap.js`, `lib/mentorProfile.js`, `lib/studentProfile.js` |
| i18n | `lib/localeEn.js`, `lib/localeKm.js` |

**Rule:** Pure functions only — no `fetch`, no `useState`.

---

## 8. `src/constants/` — Config & defaults

```
constants/
├── config/env.js           # isApiEnabled(), API base URL
├── ui/tokens.js            # brand, brandColors
├── ui/typography.js        # TEXT.pageTitle, TEXT.body, …
├── filters/                # mentorFilters, majors, subjects
├── mentor/mentorDefaults.js
├── student/studentRoutes.js
└── legal/legalContent.js
```

---

## 9. MVC compliance checklist (for reviewers)

Use this when reviewing a page or PR:

| Check | Pass criteria |
|-------|---------------|
| Page imports | No `@/services/` in `pages/` (except known exceptions below) |
| Controller exists | Screen logic in `hooks/<domain>/use*.js` |
| Service thin | HTTP only in `services/`; mappers in `utils/` |
| Components | Presentational — data via props or domain hook |
| Routes | Defined in `App.jsx` with `ProtectedRoute` where needed |
| i18n | User strings via `useTranslation()` / `t('key')` |
| Khmer content | `.font-khmer` on user-generated Khmer text |

### Known exceptions (pages still touching services)

| Page | Import | Status |
|------|--------|--------|
| `EditProfile.jsx` | `mentorService`, `authService` | **TODO** — extract `useMentorEditProfile` |
| `MentorCreatePost.jsx` | `buildSkillOptions`, `buildSubSkillOptions` | Minor — move to utils or hook |

### Components that may call services (widgets)

Some modals load data on open (e.g. `MentorQuickViewModal.jsx`). Prefer moving to hooks when refactoring.

---

## 10. Quick reference — good vs bad

**Good (MVC):**

```jsx
// pages/student/Home.jsx
import { useMentors, useMentorFilters } from '@/hooks'

const Home = () => {
  const { filters, setFilter } = useMentorFilters()
  const { mentors, loading } = useMentors(filters)
  return <MentorList mentors={mentors} loading={loading} />
}
```

**Bad (skip controller):**

```jsx
// pages/SomePage.jsx — avoid this in new code
import { fetchSomething } from '@/services/...'

useEffect(() => {
  fetchSomething().then(setData)
}, [])
```

---

## 11. Related commands

```bash
cd frontend
npm run dev      # local dev server
npm run build    # production build
npm run lint     # ESLint
```

---

## 12. Document index

| File | Purpose |
|------|---------|
| `docs/FRONTEND_STRUCTURE.md` | This review guide |
| `docs/MVC.md` | MVC rules and examples |
| `docs/MENTOR_FRONTEND.md` | Mentor-specific conventions |
| `backend_rokkru/docs/MENTOR_BACKEND.md` | Backend MVC pairing |
| `src/components/README.md` | Component folder map |
| `src/constants/README.md` | DB-driven skills/provinces policy |

---

*Last updated for mentor-v4 MVC refactor — React 19, hooks-based controllers, glass UI.*
