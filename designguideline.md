# 🎨 PadSync — Design Guideline

> Inspired by: Credly UI — soft lavender backgrounds, white floating cards, gradient glass accents,
> clean bold typography, and premium micro-detail. The mood is calm, modern, and trustworthy —
> not playful, not corporate. Think "Apple meets Notion meets a drawing tool."

---

## 🧠 Design Philosophy

**Three words: Soft. Premium. Focused.**

- The canvas is the hero. Everything else steps back.
- UI should feel like it costs nothing to open — zero cognitive friction
- Color creates mood, not noise. Gradients are used sparingly as accents, never backgrounds
- Every element should feel like it belongs — nothing random, nothing decorative without purpose
- Cards float. Backgrounds breathe. Typography is confident and clean.

---

## 🎨 Color System

### Primary Palette

| Name | Hex | Usage |
|---|---|---|
| **Soft Lavender** | `#EEF0F8` | Page background — main bg for all screens |
| **Deep Ink** | `#2D3158` | Primary text, headings, icon fills |
| **Pure White** | `#FFFFFF` | Card backgrounds, surfaces |
| **Muted Slate** | `#8A8FA8` | Secondary text, labels, placeholder text |
| **Ghost Border** | `rgba(160,170,210,0.18)` | Card borders, dividers — always ultra-subtle |

### Accent Palette (Gradient Pair — Core Brand)

| Name | Hex | Usage |
|---|---|---|
| **Iris Purple** | `#7B7FD4` | Primary accent, active states, brand color |
| **Soft Violet** | `#B48FE0` | Gradient end, secondary accent |
| **Blush Pink** | `#F5DAEA` | Gradient card tint, soft backgrounds |
| **Lavender Mid** | `#C9CCEE` | Gradient card start |

The brand gradient is always: `linear-gradient(135deg, #7B7FD4, #B48FE0)`
The soft card gradient is always: `linear-gradient(135deg, #C9CCEE 0%, #E8D5F5 50%, #F5DAEA 100%)`

### Semantic Colors

| Name | Hex | Usage |
|---|---|---|
| **Success Green** | `#3DD68C` | Connected status, low latency, positive states |
| **Alert Red** | `#E05A6A` | Destructive actions (clear, delete), errors |
| **Warm Yellow** | `#FFD166` | Warnings, highlights |
| **Accent Pink** | `#FF7BAC` | Color picker swatch, decorative only |

### Dark Mode Equivalents

| Light | Dark |
|---|---|
| `#EEF0F8` bg | `#13141F` bg |
| `#FFFFFF` card | `#1C1E2E` card |
| `#2D3158` text | `#E8EAF6` text |
| `#8A8FA8` muted | `#6B6F85` muted |
| `rgba(160,170,210,0.18)` border | `rgba(160,170,210,0.10)` border |

---

## ✍️ Typography

### Font Family
- **Primary:** `Inter` (Google Fonts) — clean, geometric, highly legible
- **Fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Mono (code/room codes):** `JetBrains Mono` or `monospace`

### Type Scale

| Name | Size | Weight | Usage |
|---|---|---|---|
| App Name | 20px | 700 | PadSync wordmark in header |
| Heading 1 | 28px | 700 | Hero text, large feature headings |
| Heading 2 | 18px | 600 | Section titles, card titles |
| Heading 3 | 14px | 600 | Sidebar labels, group headings |
| Body | 13px | 400 | General text, descriptions |
| Caption | 11px | 400 | Timestamps, metadata, hints |
| Stat Number | 16px | 600 | Dashboard metric values |
| Room Code | 13px | 600 | Monospace, letter-spacing 0.08em |

### Typography Rules
- All headings use `#2D3158` (Deep Ink) — never pure black
- Body text uses `#2D3158` at 80% opacity or `#8A8FA8` for secondary
- Line height: 1.5 for body, 1.2 for headings
- Letter spacing: normal for most text, `0.05–0.08em` for labels and caps
- No ALL CAPS except for micro-labels (CONNECTED, ROOM CODE)

---

## 📐 Spacing & Layout

### Spacing Scale
```
4px   — micro gap (between icon and label)
8px   — tight gap (between related elements)
12px  — component padding (inside chips, small buttons)
16px  — standard padding (inside cards, sections)
20px  — medium gap (between cards, sections)
24px  — large gap (between major layout regions)
32px  — page padding (outer screen margins)
```

### Border Radius Scale
```
6px   — small elements (chips, badges, tags)
10px  — buttons, inputs, small cards
14px  — toolbar cards, inner panels
20px  — main cards, phone screen sections
28px  — device frames, outer containers
99px  — pills (status chips, color swatches row)
50%   — circular elements (avatars, color dots)
```

### Layout Grid
- **Mobile:** Single column, 16px horizontal padding
- **Desktop:** Left sidebar (180px fixed) + main canvas (flexible)
- **Max content width:** 1200px, centered
- **Sidebar width:** 180px on desktop, hidden on mobile (bottom sheet instead)

---

## 🃏 Card System

Cards are the fundamental unit of PadSync's UI. Every floating surface is a card.

### Base Card
```css
background: #FFFFFF;
border-radius: 20px;
border: 1px solid rgba(160, 170, 210, 0.18);
padding: 16px;
```
No box-shadow. Depth comes from the background color contrast against `#EEF0F8`.

### Gradient Card (accent/highlight)
```css
background: linear-gradient(135deg, #C9CCEE 0%, #E8D5F5 50%, #F5DAEA 100%);
border-radius: 20px;
```
Used for: connection status card, pairing confirmation, feature highlights.

### Glass Pill / Chip
```css
background: rgba(255, 255, 255, 0.72);
border: 1px solid rgba(160, 170, 210, 0.25);
border-radius: 99px;
padding: 4px 12px;
font-size: 11px;
color: #5B6180;
backdrop-filter: blur(8px);
```
Used for: "Connected" status, room code display, mode labels.

### Dark Card (for canvas overlay or stats)
```css
background: #1C1E2E;
border-radius: 14px;
```
Used sparingly — for charts, dark widgets inside the interface.

---

## 🔘 Buttons

### Primary Button (CTA)
```css
background: linear-gradient(135deg, #7B7FD4, #B48FE0);
color: #FFFFFF;
border-radius: 10px;
padding: 10px 20px;
font-size: 13px;
font-weight: 600;
border: none;
```
Used for: Save, Export, Connect, Launch App.

### Secondary Button
```css
background: #FFFFFF;
color: #2D3158;
border: 1px solid rgba(160, 170, 210, 0.3);
border-radius: 10px;
padding: 9px 18px;
font-size: 13px;
font-weight: 500;
```
Used for: Cancel, Back, secondary actions.

### Destructive Button
```css
background: rgba(224, 90, 106, 0.08);
color: #E05A6A;
border: 1px solid rgba(224, 90, 106, 0.2);
border-radius: 10px;
```
Used for: Clear Canvas, Disconnect, Delete.

### Toolbar Icon Button
```css
width: 36px;
height: 36px;
border-radius: 10px;
background: rgba(255, 255, 255, 0.70);
border: 1px solid rgba(160, 170, 210, 0.30);
display: flex;
align-items: center;
justify-content: center;
```
Active state: `background: linear-gradient(135deg, #7B7FD4, #B48FE0)` with white icon.

---

## 🔵 Status Indicators

### Connected (green)
```
● dot: #3DD68C, 6px circle
  label: "Connected" — 11px, #5B6180
  container: glass pill
```

### Disconnected / Searching (gray)
```
● dot: #C5C8D8, 6px circle — pulsing animation
  label: "Searching..." — 11px, #8A8FA8
```

### Latency Display
- < 20ms → `#3DD68C` (green — excellent)
- 20–50ms → `#FFD166` (yellow — good)
- > 50ms → `#E05A6A` (red — warn user)

---

## 📱 Mobile Screen Layout

```
┌─────────────────────────────────┐
│  9:41              [battery]    │  ← status bar, 22px height
├─────────────────────────────────┤
│  [logo] PadSync    ● Connected  │  ← top bar, 44px height, white bg
├─────────────────────────────────┤
│                                 │
│                                 │
│       CANVAS AREA               │  ← flex:1, fills all remaining space
│   (drawing surface - #FAFBFF)   │     faint dashed border
│   faint dashed border           │     center hint text when empty
│                                 │
│                                 │
├─────────────────────────────────┤
│  [pen][eraser][colors][size]    │  ← toolbar card, white bg, 60px
│                    [undo][clear]│     floating above canvas
├─────────────────────────────────┤
│  Laptop connected  192.168.x.x  │  ← gradient card, 56px
│  room XK-492              [wifi]│     soft lavender gradient
└─────────────────────────────────┘
```

**Mobile Rules:**
- Canvas takes minimum 65% of screen height
- Toolbar is always visible, never hides
- No navigation tabs — single screen app
- Connection card slides up from bottom on connect
- When disconnected: canvas dims to 40% opacity + "waiting for laptop" chip

---

## 💻 Desktop (Electron) Screen Layout

```
┌────────────────────────────────────────────────────────────┐
│  [logo] PadSync              ● Phone connected  [settings] │  ← topbar, 44px, white
├──────────────┬─────────────────────────────────────────────┤
│              │                                             │
│  Canvas      │                                             │
│  ─────────   │                                             │
│  Draw ●      │         MAIN CANVAS                         │
│  Erase       │     (white drawing surface)                 │
│  Pan         │     receives strokes from phone             │
│              │     room code chip top-right                │
│  Stroke      │                                             │
│  ─────────   │                                             │
│  Size  3px   │                                             │
│  [slider]    │                                             │
│  Colors: ●●  ├─────────────────────────────────────────────┤
│              │ Strokes: 142  Latency: 12ms  Session: 14m  [Save] │
│  Session     │                                             │
│  ─────────   │
│  Export PNG  │
│  Clear all   │
│              │
└──────────────┘
  180px fixed     flexible
```

**Desktop Rules:**
- Sidebar is always 180px, never collapsible in MVP
- Canvas fills 100% of remaining width and height
- Stats bar sits below canvas — always visible
- Top bar height: 44px — same as mobile for visual consistency
- All sidebar interactions happen in-place (no modals for basic tool switching)
- Room code is a clickable chip → copies to clipboard

---

## ✨ Micro-interactions & Animation

### Principles
- Every tap/click should have feedback within 100ms
- Animations should feel physical — ease-out for appearing, ease-in for disappearing
- Nothing should flash or jolt — smooth is the word

### Key Animations

| Interaction | Animation |
|---|---|
| Toolbar button active | Scale 0.92 → 1.0, 120ms ease-out + gradient bg swap |
| Connected status appear | Fade in + slide up 4px, 200ms |
| Stroke appears on canvas | Immediate — no delay, 0ms |
| Canvas clear | Fade out strokes, 300ms ease-out |
| Room code copy | Brief "Copied!" tooltip, 1.5s auto-dismiss |
| Disconnect | Canvas dims to 40%, searching pill pulses |
| Export button | Brief loading spinner, then success checkmark |

### Canvas Stroke Rendering
- Stroke must appear with zero perceptible lag
- Use `requestAnimationFrame` for all canvas draws
- Minimum stroke width: 1px, maximum: 20px
- Stroke color renders immediately — color picker is instant

---

## 🔠 Iconography

- **Library:** Lucide Icons (React) or Tabler Icons
- **Style:** Outline only — no filled icons except active toolbar state
- **Size:** 16px inline, 20px in toolbars, 24px max for feature icons
- **Color:** Inherits from parent — never hardcoded
- **Active icon color:** `#FFFFFF` on gradient button background

### Key Icons (standardized mapping)
```
ti-writing / pencil-line  → draw tool
ti-eraser                 → erase tool
ti-hand-stop              → pan tool
ti-palette                → color picker
ti-minus / slider         → stroke size
ti-arrow-back-up          → undo
ti-trash                  → clear all
ti-download               → export
ti-wifi                   → connection
ti-qrcode                 → room code / pairing
ti-settings               → settings
ti-x                      → close / disconnect
```

---

## 🖼️ Logo & Wordmark

### Logo Mark
- Geometric shape — a stylized pen nib or writing gesture inside a rounded square
- Colors: gradient from `#7B7FD4` → `#B48FE0`
- Sizes: 28×28px (mobile header), 24×24px (desktop header), 48×48px (splash/landing)
- Dark mode: same gradient (stays vibrant on dark bg)

### Wordmark
- Font: Inter 700
- Color: `#2D3158` (light mode), `#E8EAF6` (dark mode)
- Letter spacing: normal
- Always paired with logo mark, logo mark on left

---

## 🌙 Dark Mode

Dark mode is a first-class citizen, not an afterthought.

### Dark Palette
```
Page bg:        #13141F
Card bg:        #1C1E2E
Card border:    rgba(160,170,210,0.10)
Sidebar bg:     rgba(255,255,255,0.03)
Primary text:   #E8EAF6
Secondary text: #6B6F85
Canvas bg:      #1A1B2E
```

### Dark Mode Rules
- Brand gradient (`#7B7FD4 → #B48FE0`) stays the same in dark mode — it pops beautifully
- Green/red semantic colors same hex, slightly reduced opacity (85%)
- Canvas bg changes to `#1A1B2E` — dark but clearly distinct from cards
- Default stroke color on dark canvas: `#E8EAF6` (near white)

---

## 🚫 Design Don'ts

- ❌ No box shadows — depth comes from bg color contrast only
- ❌ No pure black (#000000) anywhere — use Deep Ink (#2D3158)
- ❌ No pure white text on gradient buttons — use #FFFFFF only
- ❌ No more than 2 gradients on screen at the same time
- ❌ No rounded corners less than 6px
- ❌ No font sizes below 11px
- ❌ No centered-aligned body text — left-align always
- ❌ No border-radius on single-sided borders
- ❌ No animations over 400ms — feels sluggish
- ❌ No full-screen modals for simple confirmations — use inline states or bottom sheets

---

## ✅ Design Dos

- ✅ Cards float on the lavender bg — use white cards on #EEF0F8 always
- ✅ Use the gradient pair sparingly — primary CTA, active tool, logo only
- ✅ Status always visible — connection state must never be hidden
- ✅ Canvas is sacred — never overlay anything permanent on it
- ✅ Touch targets minimum 44×44px on mobile
- ✅ Consistent 20px border-radius on all main cards
- ✅ Gradient card for any "celebration" moment (connected, saved, exported)
