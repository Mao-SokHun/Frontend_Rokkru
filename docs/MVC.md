# Frontend MVC Architecture

The frontend follows **MVC** aligned with `backend_rokkru/` (Express routes → controllers → models).

## Layer map

| MVC | Folder | Responsibility |
|-----|--------|----------------|
| **Route** | `App.jsx` | URL → page component |
| **View** | `pages/`, `components/` | JSX only — compose UI, no direct API |
| **Controller** | `hooks/` | State, effects, mutations (like backend controllers) |
| **Model** | `services/` | HTTP / API (`fetch` via `services/core/api.js`) |
| **Transform** | `utils/`, `lib/` | Pure mappers, filters (no React, no HTTP) |
| **Middleware** | `hooks/auth/`, route guards | Auth session, RBAC |

## Data flow

```
User action on page (View)
  → hook (Controller)
  → service (Model) → /api/v1/…
  → utils mapper → hook state
  → View re-renders
```

## Rules

1. **Pages must not import `@/services/`** — use a hook in `hooks/` instead.
2. **Components must not import `@/services/`** — receive data via props or use a hook only for local widget logic.
3. **Services** — all HTTP; paths from `services/core/endpoints.js`.
4. **Hooks** — one hook per screen or feature (`useMentorDashboard`, `useStudentBookings`, …).
5. **Utils** — API row → UI shape (`mentorMapper`, `splitExperienceByType`).

## Controller folders (by domain)

```
hooks/
├── auth/          # Session, login
├── mentor/        # Mentor screens
├── student/       # Student screens
├── platform/      # Notifications, billing, Stripe
├── admin/         # Admin dashboard
├── forms/         # Reusable form state
└── ui/            # UI-only hooks (modal, pagination)
```

## Examples

| Page | Controller | Model |
|------|------------|-------|
| `MentorHome.jsx` | `useMentorDashboard` | `mentorService` |
| `Home.jsx` | `useMentors`, `useMentorFilters` | `mentorService` |
| `StudentBookings.jsx` | `useStudentBookings` | `studentBookingService` |
| `Notifications.jsx` | `useNotificationInbox` | `notificationService` |

## Backend pairing

See `backend_rokkru/docs/MENTOR_BACKEND.md` and `frontend/docs/MENTOR_FRONTEND.md`.
