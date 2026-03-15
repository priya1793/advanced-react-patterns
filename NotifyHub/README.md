# 🔔 Facebook-Style Notification System

A real-time notification system built with React, inspired by Facebook's notification UX. This project demonstrates advanced React patterns including global state management, real-time event streaming, error boundaries, and optimistic UI updates.

---

## 🎯 What This Project Is

A fully functional notification engine that replicates the core notification experience of Facebook — bell icon with badge, dropdown panel, read/unread tracking, notification grouping, and live updates — all running in the browser with no backend required.

---

## ✨ Features

### Core Functionality

- **🔔 Notification Bell with Badge** — Unread count badge with pop animation on new notifications
- **📋 Notification Dropdown** — 360px popover with scrollable notification list (max 480px height)
- **✅ Read/Unread Status** — Click to mark individual notifications as read; visual distinction with blue background for unread items and blue dot indicator
- **📌 Mark All as Read** — One-click button in the dropdown header to clear all unread notifications
- **🗂️ Notification Grouping** — Automatic grouping into "New" (unread) and "Earlier" (read) sections
- **⚡ Live Updates** — Simulated real-time notifications arriving every 8–15 seconds

### Notification Types

| Type           | Icon | Example                                |
| -------------- | ---- | -------------------------------------- |
| Like           | 👍   | "liked your post about weekend hiking" |
| Comment        | 💬   | "commented: 'This is amazing!'"        |
| Mention        | @    | "mentioned you in a comment"           |
| Share          | ↗    | "shared your post with 3 others"       |
| Friend Request | 👤   | "sent you a friend request"            |

### Advanced React Concepts

- **Zustand** — Global state management with `subscribeWithSelector` middleware
- **React Query** — Data fetching with caching for initial notification load
- **React Error Boundary** — Class-based error boundary wrapping the notification list; graceful fallback with retry
- **Zod Validation** — Every incoming notification is schema-validated before hitting the store
- **`React.memo`** — Memoized notification items and avatars to prevent unnecessary re-renders
- **`useCallback` / `useMemo`** — Optimized event handlers and computed groupings
- **Custom Hooks** — `useSocketNotifications` encapsulates the real-time event stream logic

---

## 🏗️ Architecture

```
src/
├── components/
│   ├── NotificationNavbar.tsx      # Top nav bar with bell + dropdown integration
│   ├── NotificationBell.tsx        # Bell icon trigger with animated badge
│   ├── NotificationDropdown.tsx    # Dropdown panel with header, grouping, scroll
│   ├── NotificationItem.tsx        # Individual notification row (memoized)
│   ├── NotificationAvatar.tsx      # Avatar with type-badge overlay (memoized)
│   ├── NotificationSkeleton.tsx    # Skeleton loader matching item layout
│   └── NotificationErrorBoundary.tsx # Error boundary with retry
├── store/
│   └── notificationStore.ts        # Zustand store (state + actions)
├── hooks/
│   └── useSocketNotifications.ts   # Simulated Socket.IO real-time hook
├── types/
│   └── notification.ts             # Zod schemas + TypeScript types
├── lib/
│   ├── mockNotifications.ts        # Mock data generator + fetch function
│   └── timeUtils.ts                # Relative time formatting
└── pages/
    └── Index.tsx                    # Main page with feed + navbar
```

### Data Flow

```
[Simulated Socket] → Zod.parse() → Zustand Store → React Components
                                         ↑
[React Query fetch] → initial load ──────┘
```

1. **Initial Load**: React Query fetches 15 historical notifications → sets them in Zustand via `setInitial()`
2. **Live Updates**: `useSocketNotifications` hook generates a new notification every 8–15s → validates with Zod → pushes to Zustand via `addNotification()`
3. **User Actions**: Click notification → `markAsRead()` / Click "Mark all" → `markAllRead()`

---

## 🧪 Validation Steps

### Manual Testing Checklist

| #   | Test                         | Expected Result                                                             |
| --- | ---------------------------- | --------------------------------------------------------------------------- |
| 1   | Page load                    | Navbar appears with bell icon; badge shows "3" (3 unread from initial data) |
| 2   | Wait 8–15 seconds            | Badge count increments; pop animation plays                                 |
| 3   | Click bell icon              | Dropdown opens with "Notifications" header and grouped list                 |
| 4   | Verify "New" section         | Unread notifications have blue background and blue dot                      |
| 5   | Verify "Earlier" section     | Read notifications have white background, no dot                            |
| 6   | Click an unread notification | Background transitions to white; dot disappears; badge decrements           |
| 7   | Click "Mark all as read"     | All items become read; badge disappears; "New" section empties              |
| 8   | Click outside dropdown       | Dropdown closes                                                             |
| 9   | Click bell again             | Dropdown toggles open/closed                                                |
| 10  | Click the search input       | Input receives focus with blue border highlight                             |
| 11  | Scroll notification list     | Custom thin scrollbar appears; list scrolls smoothly                        |
| 12  | Check console for errors     | No errors; malformed notifications log warnings                             |

### Error Boundary Test

To verify the error boundary, you can temporarily throw an error in `NotificationItem` — the dropdown will show "Unable to load notifications" with a "Try again" button instead of crashing the entire app.

---

## 🛠️ Tech Stack

| Technology      | Purpose                                     |
| --------------- | ------------------------------------------- |
| **React 18**    | UI framework with concurrent features       |
| **TypeScript**  | Type safety across all components           |
| **Zustand**     | Lightweight global state management         |
| **React Query** | Server state / data fetching with caching   |
| **Zod**         | Runtime validation of notification payloads |
| **Vite**        | Fast dev server and build tool              |

### Key Design Decisions

- **Inline styles over CSS classes** — Colocation of styles with components; no class name conflicts
- **System font stack** — `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto` for native feel
- **Skeleton loaders** — Shimmer animation matching notification item silhouette (no spinners)
- **Optimistic updates** — Zustand updates immediately on user action; no loading states for read/unread

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

                                  |

---

## 📄 License

MIT
