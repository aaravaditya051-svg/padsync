# 📋 PadSync — Project Plan

## 🎯 What Is This?

**PadSync** is a SaaS tool that turns your phone screen into a wireless writing pad for your Windows laptop. Open a URL on your phone, pair it with the desktop app, and start writing, doodling, or taking notes — all rendered live on your laptop canvas. No expensive hardware. No stylus required. Just your phone and a WiFi connection.

---

## 🧭 Core Objectives

1. **Primary:** Phone browser → real-time writing input → rendered on Windows desktop canvas
2. **Secondary (later):** Trackpad-as-writing-surface (Windows driver exploration — post-MVP)
3. **Tertiary (later):** Save, export, and sync drawings across sessions

---

## 👤 Target User

Everyday users — students, casual note-takers, remote workers — who want a quick, handy digital writing surface without investing in professional gear like Wacom tablets.

---

## 🛠️ Tech Stack

### Frontend (Phone PWA)
- **Framework:** React (Vite) — PWA enabled
- **Canvas:** Tldraw (open source whiteboard engine)
- **Styling:** TailwindCSS
- **Communication:** Socket.io client

### Desktop App (Windows Receiver)
- **Framework:** Electron.js
- **Canvas Renderer:** Tldraw or Fabric.js
- **Communication:** Socket.io client

### Backend / Signaling Server
- **Runtime:** Node.js
- **Framework:** Express.js
- **Real-time:** Socket.io
- **Hosting (free):** Railway.app or Render.com

### Auth (Phase 4+)
- **Tool:** Supabase Auth (free tier)

### Storage (Phase 5+)
- **Tool:** Supabase (free tier) — save/export drawings

### Landing Page (Phase 6)
- **Framework:** Astro.js — perfect for static marketing pages

---

## 🗺️ Architecture Overview

```
[Phone Browser — React PWA]
         |
         |  WebSocket over local WiFi
         |
[Node.js + Socket.io Server]  ←→  [Supabase — optional, Phase 5+]
         |
         |  WebSocket
         |
[Electron Desktop App — Windows]
         |
   [Canvas — Tldraw]
```

---

## 📦 Build Phases

### ✅ Phase 1 — Project Scaffold & Base UI (Frontend First)
> Goal: Get the visual shell up. No real-time yet. Just the UI working in browser.

- Set up React + Vite + TailwindCSS project
- Create phone PWA canvas screen (blank drawing area)
- Create desktop Electron shell with canvas receiver screen
- Set up folder structure (modular — see instruction.md)
- Confirm Tldraw renders correctly in both environments
- **Deliverable:** Both UIs open and render a blank canvas. No connection yet.

---

### ✅ Phase 2 — Real-time Communication Core
> Goal: Phone strokes appear on the desktop in real-time.

- Build Node.js + Express + Socket.io signaling server
- Implement room/pairing system (6-digit code like `ABC-123`)
- Phone emits stroke events → server relays → desktop renders
- Handle connect / disconnect / reconnect gracefully
- **Deliverable:** Draw on phone, see it live on desktop.

---

### ✅ Phase 3 — Pairing UX & Polish
> Goal: Make the connection experience smooth and foolproof.

- QR code pairing (scan on phone to auto-connect)
- Connection status indicator (connected / searching / lost)
- Basic toolbar on phone: pen, eraser, clear canvas
- Latency indicator (debug mode toggle)
- **Deliverable:** Clean, usable pairing flow. Feels like a real product.

---

### ✅ Phase 4 — PWA & Desktop Installer
> Goal: Make it installable — feels native, not just a browser tab.

- Configure PWA manifest + service worker on phone app
- Package Electron app as a Windows `.exe` installer
- Auto-launch tray icon on Windows startup (optional toggle)
- **Deliverable:** Phone app is installable. Desktop app is a proper `.exe`.

---

### ✅ Phase 5 — Save, Export & Cloud Sync
> Goal: Users can keep their work.

- Save canvas as PNG / PDF
- Integrate Supabase — user accounts, saved sessions
- Load previous drawings on desktop
- **Deliverable:** Basic cloud save and export working.

---

### Phase 6 — Landing Page & Launch
> Goal: Public-facing presence.

- Build landing page with Astro.js
- Demo video / GIF embed
- Download link for Electron `.exe`
- Waitlist / early access email capture
- **Deliverable:** Public landing page live. Ready to share.


---

## 🚫 Out of Scope (for now)
- Trackpad-as-writing-surface (deferred — driver complexity)
- iOS/Android native apps (PWA covers this)
- Collaboration (multi-user canvas) — post-MVP
- Monetization / subscription billing — post-MVP

---

## 📁 Folder Structure (Top Level)

```
padsync/
├── apps/
│   ├── phone-pwa/          # React + Vite PWA (phone writing pad)
│   ├── desktop/            # Electron app (Windows canvas receiver)
│   └── server/             # Node.js + Socket.io signaling server
├── packages/
│   └── shared/             # Shared types, constants, utilities
├── landing/                # Astro.js marketing site (Phase 6)
├── plan.md
├── instruction.md
├── gemini.md
└── package.json            # Monorepo root (pnpm workspaces)
```
