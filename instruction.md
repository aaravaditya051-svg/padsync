# 🧭 instruction.md — Agent Working Rules for PadSync

## 📌 Project Context

You are building **PadSync** — a SaaS tool that turns a phone browser into a real-time wireless writing pad for a Windows laptop. Read `plan.md` fully before doing anything. Understand the architecture, the phases, and the tech stack before writing a single line of code.

---

## 🛑 BEFORE YOU START — MANDATORY

**Do NOT begin building anything until you have:**

1. Read `plan.md` completely
2. Read `instruction.md` completely (this file)
3. Read `designguideline.md` completely
4. Asked the user any clarifying questions you have
5. Summarized your build plan for Phase 1 and gotten a **"go ahead"** from the user

**Only after receiving explicit approval should you write any code.**

---

## 🚫 NON-NEGOTIABLES — NEVER VIOLATE THESE

> These rules are absolute. They are not suggestions. They apply to every file, every phase, every decision.

### 1. Strictly Modular File Structure
- Every file must be responsible for **one specific task only**
- No "god files" — no single file doing routing + state + UI + logic together
- If a component does two distinct things, split it into two files
- Name files clearly after their single responsibility: `useSocketConnection.js`, `CanvasRenderer.jsx`, `roomCodeGenerator.js`

### 2. 600-Line Hard Limit Per File
- **No file may exceed 600 lines of code**
- If you are approaching 500 lines, stop and plan a refactor before continuing
- Split into smaller focused modules and import them
- This limit exists to protect context windows and prevent cascading breakage

### 3. Proactive Refactoring
- If an existing file is growing beyond its responsibility, refactor it **before** adding new code
- Never pile new features into an already-complex file
- Refactoring is not optional — it is part of the build process

### 4. Ask Before You Build
- Before starting any new phase, summarize what you plan to build and ask for confirmation
- Before making a structural decision (new folder, new shared utility, changing a pattern), ask first
- When in doubt — ask. Never assume.

### 5. No Silent Changes
- If you change something that was previously working, say so explicitly
- Never silently refactor something that wasn't asked for without flagging it
- Always explain what changed and why when touching existing code

### 6. Phase Discipline
- Build only what the current phase requires
- Do not scaffold future phases speculatively
- Keep phases clean and deliverable-focused

---

## 🧱 Code Architecture Rules

### Monorepo Structure
```
padsync/
├── apps/
│   ├── phone-pwa/       → React + Vite PWA
│   ├── desktop/         → Electron app
│   └── server/          → Node.js + Socket.io
├── packages/
│   └── shared/          → Shared types, constants, event names
├── landing/             → Astro.js (Phase 6 only)
├── plan.md
├── instruction.md
└── package.json
```

### Folder Rules Per App
Each app must follow this internal structure:

```
phone-pwa/
├── src/
│   ├── components/      → UI components (one per file)
│   ├── hooks/           → Custom React hooks (one concern per hook)
│   ├── pages/           → Page-level components only
│   ├── services/        → Socket, API, external communication
│   ├── utils/           → Pure utility functions
│   ├── constants/       → App-wide constants
│   └── types/           → TypeScript types/interfaces
```

Apply the same pattern to `desktop/` and `server/`.

### Shared Package
- All Socket.io event name strings go in `packages/shared/events.js`
- All shared TypeScript types go in `packages/shared/types.ts`
- Never hardcode event strings in app code — always import from shared

---

## 🔧 Tech Constraints

- **Package manager:** pnpm (workspaces for monorepo)
- **Node version:** 18+ (LTS)
- **React:** Vite-based, not CRA
- **No class components** — functional components + hooks only
- **No inline styles** — TailwindCSS only
- **Canvas library:** Tldraw (primary), Fabric.js (fallback only if Tldraw causes issues)
- **Socket:** Socket.io (not raw WebSocket, not Pusher)
- **Everything free** — no paid services, no API keys with costs

---

## 🧪 Testing & Stability

- After completing each phase, manually verify the deliverable works before moving on
- If something breaks that was previously working, fix it before proceeding
- Do not leave broken code and move forward — the phases are sequential for a reason

---

## 📝 Comment Standards

- Every function must have a one-line comment explaining what it does
- Every file must have a top-of-file comment stating its single responsibility
- Example:
```js
// responsibility: manages socket connection lifecycle for the phone PWA client
```

---

## 🤝 Communication Protocol With User

- Use clear section headers when giving updates
- When showing code, always specify the file path
- When a phase is complete, explicitly say: **"Phase X complete — deliverable: [what works now]"**
- When asking a question, ask only **one question at a time**

---

## 💻 CLI Notes (Gemini Specific)

### Session Startup Checklist
You have no memory between sessions. At the start of every new session, before doing anything:
1. Re-read `plan.md` — confirm which phase you're in
2. Re-read this file — refresh the non-negotiables
3. Re-read `designguideline.md` — before any UI work
4. Ask the user: *"Which phase are we continuing from, and what was the last completed deliverable?"*

**Never assume you know the current project state — always ask or check.**

### pnpm Workspace Commands
```bash
# Install all dependencies from root
pnpm install

# Run a specific app
pnpm --filter phone-pwa dev
pnpm --filter desktop dev
pnpm --filter server dev

# Add a package to a specific app
pnpm --filter phone-pwa add socket.io-client
pnpm --filter server add express socket.io
```

### Environment Variables
- Never hardcode URLs, ports, or secrets in code
- Each app gets its own `.env` file:
  - `apps/phone-pwa/.env` → `VITE_SOCKET_URL=...`
  - `apps/server/.env` → `PORT=3001`
  - `apps/desktop/.env` → `SOCKET_SERVER_URL=...`
- Add `.env` to `.gitignore` immediately
- Always provide a `.env.example` with placeholder values

### One File At A Time
- Create or edit one file, confirm it looks right, then move to the next
- Never batch-create multiple files in one go
- Always use full paths from project root: `apps/phone-pwa/src/hooks/useSocketConnection.js`

---

## ⚠️ If You're Unsure

Stop. Ask. Do not guess on architectural decisions. A 30-second question saves hours of broken code.
