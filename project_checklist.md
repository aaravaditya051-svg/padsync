# 📋 PadSync Project Checklist

This checklist breaks down the PadSync project into actionable phases and sub-phases, based on `plan.md` and `instruction.md`.

## 🛑 Pre-Requisites (Before Phase 1)
- [ ] Read `plan.md` completely.
- [ ] Read `instruction.md` completely.
- [ ] Read `designguideline.md` completely.
- [ ] Ask any clarifying questions to the user.
- [ ] Summarize the build plan for Phase 1 and get a **"go ahead"** from the user.

---

## ✅ Phase 1 — Project Scaffold & Base UI (Frontend First)
> **Goal:** Get the visual shell up. No real-time yet. Just the UI working in browser.

### 1.1 Project Setup
- [ ] Initialize monorepo structure (using `pnpm`).
- [ ] Set up React + Vite + TailwindCSS project for phone PWA (`apps/phone-pwa`).
- [ ] Set up Electron.js project for desktop shell (`apps/desktop`).
- [ ] Scaffold shared types and constants package (`packages/shared`).

### 1.2 Base UI Development
- [ ] Create modular folder structure (components, hooks, pages, services, utils, constants, types).
- [ ] Create phone PWA canvas screen (blank drawing area).
- [ ] Create desktop Electron shell with canvas receiver screen.
- [ ] Test and confirm Tldraw (or Fabric.js fallback) renders correctly in both environments.

### 1.3 Verification
- [ ] **Deliverable Check:** Both UIs open and render a blank canvas successfully without errors.

---

## ✅ Phase 2 — Real-time Communication Core
> **Goal:** Phone strokes appear on the desktop in real-time.

### 2.1 Backend Setup
- [ ] Initialize Node.js + Express + Socket.io signaling server (`apps/server`).

### 2.2 Core Engine
- [ ] Implement room/pairing system (e.g., using a 6-digit code like `ABC-123`).
- [ ] Connect Phone to emit stroke events to server.
- [ ] Connect Desktop to receive relayed events and render them live.
- [ ] Implement graceful handling for connect, disconnect, and reconnect events.

### 2.3 Verification
- [ ] **Deliverable Check:** Drawing on the phone renders live on the desktop application.

---

## ✅ Phase 3 — Pairing UX & Polish
> **Goal:** Make the connection experience smooth and foolproof.

### 3.1 Connection UX Improvements
- [x] Implement QR code pairing (scan on phone to auto-connect).
- [x] Build a connection status indicator (connected / searching / lost).

### 3.2 Drawing Tools
- [x] Add basic toolbar on the phone: pen, eraser, clear canvas. (Restored rich Tldraw UI!)
- [x] Add a latency indicator (with a debug mode toggle).

### 3.3 Verification
- [x] **Deliverable Check:** Clean, intuitive, and usable pairing flow established.

---

## ✅ Phase 4 — PWA & Desktop Installer
> **Goal:** Make it installable — feels native, not just a browser tab.

### 4.1 Phone Application
- [x] Configure PWA manifest on phone app.
- [x] Configure service worker for the PWA.

### 4.2 Desktop Application
- [x] Package the Electron app as a Windows `.exe` installer.
- [ ] Add auto-launch tray icon on Windows startup (with an optional toggle).

### 4.3 Verification
- [ ] **Deliverable Check:** Phone app is locally installable; Desktop app has a proper `.exe` installer.

---

## ✅ Phase 5 — Save, Export & Cloud Sync
> **Goal:** Users can keep their work.

### 5.1 Local Export
- [x] Implement save canvas as PNG feature.
- [x] Implement save canvas as PDF feature.

### 5.2 Cloud Integration (SKIPPED)
> *Pivot: The user correctly noted that PadSync is a live writing tool, so persistent cloud storage/accounts are unnecessary bloat.*
- [x] ~~Integrate Supabase Auth (free tier) for user accounts.~~
- [x] ~~Set up Supabase DB to save user sessions/drawings.~~
- [x] ~~Add ability to load previous drawings on the desktop canvas.~~

### 5.3 Verification
- [x] **Deliverable Check:** Local saving and PNG/PDF export functions working properly. No cloud bloat.

---

## ✅ Phase 6 — Landing Page & Launch
> **Goal:** Public-facing presence.

### 6.1 Marketing Site
- [ ] Set up Astro.js landing page (`landing/`).
- [ ] Embed demo video / GIF of PadSync in action.
- [ ] Provide download link for Electron `.exe`.
- [ ] Implement a waitlist / early access email capture form.

### 6.2 Verification
- [ ] **Deliverable Check:** Public landing page is live and ready to share.
