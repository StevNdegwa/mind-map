# Mind Map

A lightweight app for sketching ideas and notes while learning. Create lessons, then use an embedded [Excalidraw](https://excalidraw.com) canvas to draw diagrams, mind maps, and rough notes. All data is stored locally in your browser with [Dexie](https://dexie.org) (IndexedDB).

## Features

- **Lessons** — Create as many lessons as you need (e.g. per topic or course). Each has a name and its own canvas.
- **Sketching** — Each lesson opens a full Excalidraw canvas: shapes, text, arrows, free draw, and images. Ideal for mind maps and quick diagrams.
- **Auto-save** — Canvas state is saved to IndexedDB as you edit (debounced). Reopen a lesson to continue where you left off.
- **Dark / light mode** — Theme toggle in the header. Preference is stored in `localStorage` and used for both the app and the Excalidraw canvas.
- **Offline-first** — No backend; everything stays in your browser.

## Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Dexie** — IndexedDB wrapper for lessons and scene data
- **@excalidraw/excalidraw** — Embedded drawing canvas
- **CSS Modules** — Component styling

## Getting started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Install and run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## How to use

1. **Home** — On load you see the lesson list and a “New lesson name” field.
2. **Create a lesson** — Type a name and click **Add**. The new lesson appears in the list and opens automatically.
3. **Open a lesson** — Click any lesson in the list. The header shows the lesson name and a back arrow.
4. **Sketch** — Use the Excalidraw toolbar (shapes, text, arrows, hand, etc.). Changes are saved automatically.
5. **Back** — Click the back arrow to return to the lesson list and pick another lesson.
6. **Theme** — Use the sun/moon icon in the header to switch between light and dark mode.

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, theme script, metadata
│   ├── page.tsx            # Entry: ThemeProvider + MindMapClient
│   ├── page.module.css
│   ├── globals.css         # CSS variables (light/dark)
│   └── MindMapClient.tsx   # Main UI: lesson list vs lesson view
├── components/
│   ├── Header/             # Lesson title, back button, theme toggle
│   ├── LessonPicker/       # “New lesson” form + lesson list
│   ├── LessonView/         # Wrapper that loads ExcalidrawCanvas (client-only)
│   └── ExcalidrawCanvas/   # Excalidraw + load/save scene to Dexie
├── contexts/
│   └── ThemeContext.tsx    # Theme state + localStorage
└── lib/
    └── db.ts               # Dexie schema: lessons (id, name, sceneData, …)
```

### Data model (Dexie)

- **Table: `lessons`**
  - `id` — string (primary key)
  - `name` — string
  - `createdAt`, `updatedAt` — numbers (timestamps)
  - `sceneData` — string (optional), JSON from Excalidraw `serializeAsJSON(..., "database")`

Theme preference is stored in `localStorage` under the key `mind-map-theme` (`"light"` or `"dark"`).

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [Excalidraw](https://excalidraw.com) — drawing and API
- [Dexie](https://dexie.org) — IndexedDB
