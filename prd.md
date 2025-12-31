# Product Requirements Document (PRD) - Flow ToDo

## 1. Product Overview

**Product Name:** Flow ToDo
**Version:** 3.0
**Status:** Production Ready (PWA Supported)
**Description:** A modern, visually immersive, and highly responsive task management web application designed to help users organize their life with "flow". It combines powerful functionality with a premium "Big UI" aesthetic, featuring dark mode, glassmorphism, seamless interactions, and full mobile installability.

## 2. Goals & Vision

- **Visual Excellence:** Provide a task management experience that is beautiful to look at, using deep gradients, ambient lighting, and smooth animations to reduce fast-paced stress.
- **Frictionless Flow:** Minimize clicks for common actions (adding tasks to specific dates/categories).
- **Metric Visibility:** Give users immediate insight into their progress through large, clear data visualizations.
- **Anywhere Access:** Ensure the app feels native on all devices via PWA capabilities.

## 3. Key Features

### 3.1 Dashboard Command Center

- **Layout:** Responsive design adapting from vertical mobile stack to asymmetric 60:40 desktop split.
  - **Left (60%):** "Overview" section.
  - **Right (40%):** "Active Tasks" list.
- **Visuals:** Huge 4XL typography for stats, linear progress bars for rate tracking.
- **Metrics Tracked:** Total Tasks, Completed, Pending, and Completion Rate.
- **Interactions:** Hover effects, active state filtering (click stat to filter list).

### 3.2 Task Management

- **CRUD Operations:** Create, Read, Update, Delete tasks.
- **Persistence:** LocalStorage-based persistence ensuring data survives refreshes.
- **Smart Completion:** Checkbox toggle with strikethrough animation.
- **Bulk Action:** "Clear Done" button to remove all completed tasks at once.
- **Advanced Org:** Create **Custom Categories** with color coding in addition to presets.

### 3.3 Specialized Views & Drag-and-Drop

- **Today:** Filters tasks due on the current system date.
- **Upcoming:** Shows tasks due in the future, automatically grouped by date headers.
  - **D&D:** Drag tasks between date groups to reschedule instantly.
- **Projects:** Kanban-style column view for categories (Project, Personal, Work, Health, + Custom).
  - **D&D:** Drag tasks between columns to change categories.
  - **Context:** "Add Task" buttons per column pre-fill category.

### 3.4 User Interface & UX

- **Theme:** Strict Dark Mode (`slate-900` base).
- **Design System:**
  - **Colors:** Slate w/ Indigo, Purple, Emerald, Amber, and Rose accents.
  - **Effects:** Backdrop blur (glassmorphism), radial gradient backgrounds, floating ambient orbs.
  - **Typography:** Inter font, clean and readable.
- **Mobile Experience:**
  - **PWA:** Installable via browser (manifest, icons, service worker).
  - **Layout:** Bottom navigation, touch-optimized targets, hidden horizontal overflow.

## 4. Technical Specifications

### 4.1 Technology Stack

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **State:** React Context API (`TaskContext`)
- **Interaction:** `@dnd-kit` (Core, Sortable, Utilities)
- **PWA:** `vite-plugin-pwa`

### 4.2 Data Model

**Task Object:**

```json
{
  "id": "number (timestamp)",
  "title": "string",
  "category": "string (project|personal|work|health|custom_id)",
  "date": "string (YYYY-MM-DD)",
  "status": "string (pending|completed)"
}
```

## 5. User Stories

1. **As a User**, I want to see exactly how many tasks I have pending vs completed immediately upon opening the app.
2. **As a User**, I want to drag a task from "Today" to "Tomorrow" if I can't finish it.
3. **As a User**, I want to create a specific "Learning" category with its own color.
4. **As a User**, I want to install this app on my phone and have it look like a native app (no browser bar).

## 6. Future Roadmap (Post-v3.0)

- **Backend Sync:** Migrate from LocalStorage to a cloud DB (Firebase/Supabase) for cross-device sync.
- **Auth System:** User accounts and login.
- **Notifications:** Push notifications for due tasks.
