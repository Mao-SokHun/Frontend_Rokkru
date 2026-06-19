# Mentor Frontend — Basic Guide

> **This project stack** (not the capstone PDF defaults).  
> Level: basic — structure, tech, conventions.

---

## 1. Tech stack (actual)

| Area | Library | Notes |
|------|---------|--------|
| UI | React 19 + Vite | `frontend/` |
| Routing | **react-router-dom** | Routes in `App.jsx` |
| Styling | **Tailwind CSS** + clsx | Not MUI |
| Components | Radix UI primitives + custom | Not MUI |
| Icons | lucide-react | |
| Charts | recharts | Dashboard / Report |
| HTTP | `services/core/api.js` | fetch + cookies |
| State | **React hooks + AuthContext** | Not Redux |
| Forms | **useState** controlled inputs | Not react-hook-form |
| i18n | `lib/localeEn.js`, `localeKm.js` | `useTranslation()` |

**Capstone doc mentioned Redux, MUI, react-hook-form — this repo does not use them.**

---

## 2. Folder layout (MVC)

```
frontend/src/
├── pages/              # View — route screens (JSX only)
├── components/         # View — reusable UI
├── hooks/              # Controller — state, effects, mutations
│   ├── mentor/
│   ├── student/
│   ├── platform/
│   └── admin/
├── services/           # Model — HTTP API
├── utils/ + lib/       # Transforms (mappers, filters)
└── App.jsx             # Routes
```

See `frontend/docs/MVC.md` for full rules.

---

## 2a. Folder layout (mentor)

```
frontend/src/
├── pages/mentor/              # Screens (PascalCase)
│   ├── MentorHome.jsx         # Dashboard
│   ├── EditProfile.jsx
│   ├── MentorMyProfile.jsx
│   ├── Analytics.jsx          # Report
│   ├── MentorCreatePost.jsx
│   └── MentorEditPost.jsx
├── components/common/         # Reusable UI
│   ├── MentorOwnProfileView.jsx
│   ├── PortfolioSection.jsx
│   ├── ExperienceSection.jsx
│   └── ...
├── hooks/mentor/              # Data + page logic
│   ├── useMentorDashboard.js
│   └── useMentorDetail.js
├── services/mentors/          # API layer (= guide "store/apis")
│   ├── mentorService.js
│   └── mentorScheduleService.js
├── utils/                     # Mappers, filters, export
│   ├── mentorMapper.js
│   ├── mentorApiMap.js        # in lib/
│   └── analyticsFilterUtils.js
└── lib/
    ├── mentorApiMap.js        # description parse/build
    └── mentorProfile.js
```

**Rule:** Pages compose components. API calls only in `services/`. Shared logic in `hooks/` or `utils/`.

---

## 2b. MVC pattern (aligned with backend)

The frontend mirrors the backend **Express MVC** layout. React uses different folder names, but the roles match:

| Backend (`backend_rokkru/`) | Frontend (`frontend/src/`) | Role |
|------------------------------|----------------------------|------|
| `routes/v1/` | `App.jsx` + page routes | URL → screen |
| `controllers/` | `hooks/` | Request/state orchestration |
| `models/` + Sequelize | `services/` + `utils/` mappers | Data access + API→UI shape |
| `middleware/` | `hooks/auth/`, route guards in `App.jsx` | Auth, RBAC |
| JSON response | `components/` + `pages/` | View (render only) |

**Request flow (mentor dashboard):**

```
Route /mentor/home
  → MentorHome.jsx          (View — compose UI)
  → useMentorDashboard()    (Controller — load, period, delete)
  → mentorService.js        (Model — HTTP to /api/v1/mentors/…)
  → mentorMapper.js         (transform API rows)
  → PageCard, StatMetric    (View components)
```

**Rules (same spirit as backend controllers):**

1. **Pages** — JSX only; no `fetch` / `apiRequest` in pages when a hook exists or can be added.
2. **Hooks** — loading, errors, mutations, derived state (like a thin controller).
3. **Services** — all HTTP; paths from `services/core/endpoints.js`.
4. **Utils / lib** — pure mappers, filters, export helpers (no React).
5. **Components** — presentational; receive data via props.

Good example: `Home.jsx` → `useMentors` + `useMentorFilters` → `mentorService`.  
Prefer this over importing `mentorService` directly in pages for new work.

---

## 3. Comments

**Large block (page or section):**

```jsx
// ============= Start edit profile page =============
const EditProfile = () => { ... };
export default EditProfile;
// ============= End edit profile page =============
```

**Small block (inside JSX):**

```jsx
{/* Start teaching focus fields */}
<div className="grid ...">...</div>
{/* End teaching focus fields */}
```

**Inside JS handler:**

```jsx
// Start sync portfolio
await syncMentorPortfolio(userId, portfolios, snapshot);
// End sync portfolio
```

**Applied in code:** `pages/mentor/EditProfile.jsx` (page + main sections + save handler).

---

## 4. Filenames

| Type | Style | Example |
|------|--------|---------|
| Pages / components | PascalCase | `EditProfile.jsx`, `MentorHome.jsx` |
| Hooks | camelCase + use prefix | `useMentorDashboard.js` |
| Services / utils | camelCase | `mentorService.js` |

Team kebab-case (`create-task.js`) applies to static assets; React files here use **PascalCase / camelCase**.

---

## 5. Variables & functions

Same as backend convention:

- camelCase — `userId`, `fetchMyMentorPosts`
- PascalCase — components `MentorHome`, hooks `useMentorDashboard`
- `is` / `has` — booleans `isApiEnabled`, `hasBio`
- Verbs — functions `syncMentorSkills`, `mapPostsToSessionRows`

---

## 6. Routes (mentor)

| Path | Page |
|------|------|
| `/mentor/home` | Dashboard |
| `/mentor/my-profile` | My profile |
| `/mentor/edit-profile` | Edit profile |
| `/mentor/analytics` | Report |
| `/mentor/create-post` | Create schedule post |
| `/mentor/edit-post/:postId` | Edit post |

---

## 7. API usage

All mentor endpoints go through `mentorService.js`.  
Paths defined in `services/core/endpoints.js` → `ENDPOINTS.mentors`.

Enable API: env / `constants` → `isApiEnabled()`.

---

## 8. Pages vs features

| Page | Main service calls |
|------|-------------------|
| Edit Profile | profile, skills, portfolio, experience |
| My Profile | `fetchMyMentorProfileForUi`, experience, posts, portfolio |
| Dashboard | analytics, posts |
| Report | analytics, posts, export utils |
| Create/Edit Post | posts, provinces, skills |

---

## 9. Not wired to real API

- Weekly availability — removed from Edit Profile; was localStorage only
- Booking, reviews, likes — UI only
- `/sessions` — use `mentor_post` instead

---

## 10. Related docs

- Backend: `backend_rokkru/docs/MENTOR_BACKEND.md`

---

*Stack: Vite + React + Tailwind + react-router-dom + hooks (no Redux / MUI / react-hook-form).*
