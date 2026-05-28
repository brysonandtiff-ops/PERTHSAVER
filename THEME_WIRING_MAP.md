# Perth Saver - Theme Wiring Map

## Theme System Architecture

This document maps all theming sources, their propagation paths, and how components consume theme values.

---

## 0. Quick Reference for Contributors

**SINGLE SOURCE OF TRUTH**: `client/src/lib/tokens.ts` (v7.0.1)

### DO ✅
```css
/* Use tokenized CSS variables */
background: rgba(var(--cyan-bright), 0.5);
border-color: rgb(var(--emerald-bright));
box-shadow: 0 0 20px rgba(var(--obsidian), 0.8);
```

### DON'T ❌
```css
/* Never hardcode brand colors */
background: rgba(6, 182, 212, 0.5);     /* BAD */
border-color: #10B981;                   /* BAD */
box-shadow: 0 0 20px rgba(20, 20, 20);  /* BAD */
```

### Approved Exceptions
- OpenAI badge: `#10A37F`, `#0D8A6A` (external brand)
- Claude badge: `#CC785C`, `#B5634A` (external brand)
- Error red: `#EF4444` (semantic)
- Pure black/white: `rgba(0,0,0)`, `rgba(255,255,255)` (shadows/highlights)

---

## 1. Source of Truth Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                    THEMING SOURCES (Priority Order)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. client/src/lib/tokens.ts [SINGLE SOURCE OF TRUTH]           │
│     └─ TypeScript design tokens (colors, typography, spacing)   │
│     └─ TOKEN_VERSION v7.0.1 for cache busting                   │
│     └─ hexToRgbSpaced() generates space-separated RGB values    │
│     └─ generateCSSVariables() injects at runtime                │
│                                                                  │
│  2. client/src/index.css                                        │
│     └─ @theme { } block - CONSUMES tokens via rgb(var(...))     │
│     └─ :root { } fallbacks - overwritten by runtime injection   │
│     └─ Component classes (.btn-cinematic, .card-dark, etc.)     │
│                                                                  │
│  3. client/src/context/AppPreferencesContext.tsx                │
│     └─ Runtime theme preferences (dark/light, accent, etc.)     │
│     └─ localStorage key: "app-preferences"                      │
│     └─ Applies via data-theme attribute + CSS classes           │
│                                                                  │
│  4. client/public/sw.js                                         │
│     └─ CACHE_VERSION (currently: 22)                            │
│     └─ Network-first for CSS/JS in production                   │
│     └─ Disabled in development mode                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. CSS Variable Flow

### Tailwind v4 @theme Block (index.css lines 9-43)
```css
@theme {
  --color-cyan-bright: rgb(6, 182, 212);
  --color-emerald-bright: rgb(16, 185, 129);
  --color-obsidian: rgb(5, 5, 5);
  /* ... */
}
```
**Used by**: Tailwind utility classes (`bg-cyan-bright`, `text-emerald-bright`, etc.)

### :root CSS Variables (index.css lines 98-124)
```css
:root {
  --cyan-bright: 6 182 212;      /* Space-separated for rgba() */
  --emerald-bright: 16 185 129;
  --obsidian: 5 5 5;
  --glass-alpha: 0.6;
  --glow-intensity: 1;
}
```
**Used by**: Custom CSS classes (`.glass`, `.glow-cyan`, etc.)

### Runtime CSS Variables (AppPreferencesContext)
```css
html {
  --accent-color: hsl(168 78% 40%);  /* Set by accentColor preference */
  --base-font-size: 16px;             /* Set by fontSize preference */
  --animation-duration: 300ms;        /* Set by animationLevel preference */
}
```
**Set by**: `applyPreferences()` function in AppPreferencesContext.tsx

---

## 3. Theme Provider Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    THEME PROVIDER FLOW                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [App Mount]                                                      │
│       │                                                           │
│       ▼                                                           │
│  AppPreferencesProvider                                           │
│       │                                                           │
│       ├── Load from localStorage("app-preferences")               │
│       │   └─ Merge with defaultPreferences                        │
│       │                                                           │
│       ├── useLayoutEffect (BEFORE FIRST PAINT)                    │
│       │   └─ applyPreferences() called immediately                │
│       │                                                           │
│       └── useEffect (on changes)                                  │
│           ├─ Save to localStorage                                 │
│           └─ applyPreferences()                                   │
│                   │                                               │
│                   ▼                                               │
│           document.documentElement                                │
│               ├─ setAttribute('data-theme', theme)                │
│               ├─ classList.add/remove('light')                    │
│               ├─ style.setProperty('--accent-color', value)       │
│               ├─ style.setProperty('--base-font-size', value)     │
│               └─ style.setProperty('--animation-duration', value) │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Theme Consumption

### Method 1: Tailwind Utility Classes (Preferred)
```tsx
// Uses @theme custom colors from index.css
<div className="bg-obsidian text-chrome-light">
<Button className="bg-cyan-bright hover:bg-cyan-deep">
```

### Method 2: Custom CSS Classes
```tsx
// Uses .btn-cinematic, .card-dark, .glass, etc. from index.css
<Button className="btn-cinematic">Primary Action</Button>
<Card className="card-dark">Content</Card>
<div className="glass">Glassmorphism</div>
```

### Method 3: CSS Variables in Style Props
```tsx
// Uses :root CSS variables
<div style={{ 
  background: 'rgba(var(--cyan-bright), 0.2)',
  boxShadow: '0 0 20px rgba(var(--emerald-bright), 0.3)'
}}>
```

### Method 4: Theme Context Hook
```tsx
// Uses AppPreferencesContext
const { preferences, updatePreferences } = useAppPreferences();
// Access: preferences.theme, preferences.accentColor, etc.
```

---

## 5. localStorage Keys

| Key | Purpose | Default Value |
|-----|---------|---------------|
| `app-preferences` | Full theme preferences object | `{ theme: "dark", accentColor: "cyan", ... }` |
| `sidebar:state` | Sidebar open/closed state | `"true"` |
| `perth-saver-chat-history` | AI chat history | `[]` |
| `perth-saver-daily-tip` | Daily tip timestamp | timestamp |

---

## 6. Service Worker Caching Strategy

### Development Mode
```javascript
// cacheManager.ts
if (import.meta.env.DEV) {
  console.log('[Cache] Development mode - SW registration skipped');
  return;
}
```
- SW registration is **disabled** in development
- Vite HMR handles hot reloading of CSS/JS

### Production Mode
```javascript
// sw.js
const CACHE_VERSION = 22;  // Bump to force cache update

// Network-first for CSS/JS (always fresh)
if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
  event.respondWith(fetch(event.request));
  return;
}
```
- CSS/JS always fetched from network
- Other assets cached with version key
- CACHE_UPDATED message triggers reload toast

---

## 7. Theme Debug Routes

| Route | Purpose |
|-------|---------|
| `/debug/theme` | Full theme debug panel with all UI components |
| `/theme-debug` | Alias for above |
| `/theme-auditor` | Theme auditor page |
| `/theme-check` | Alias for theme auditor |

---

## 8. Hardcoded Color Audit

### ✅ Fixed (Now Using Theme Tokens)
- `client/src/pages/Home.tsx` - bg-[#050505] → bg-obsidian (4 instances)
- `client/src/pages/InvestorPitch.tsx` - bg-[#050505] → bg-obsidian (1 instance)

### 🟡 Acceptable Hardcoded Values
- Gradient hex values in style props (complex gradients that need specific colors)
- Box-shadow rgba values (theme vars used where possible)
- SVG fill/stroke colors (limited CSS var support)

---

## 9. Theme Application Checklist

When theme changes, these should update:

| Element | CSS Target | Update Method |
|---------|-----------|---------------|
| Body background | `body` | `:root --obsidian` |
| Text color | `body` | `:root --chrome-light` |
| Accent color | `html` | `--accent-color` CSS var |
| Button styles | `.btn-cinematic` | Inherits from CSS vars |
| Card styles | `.card-dark` | Inherits from CSS vars |
| Glow effects | `.glow-*` | Inherits from CSS vars |
| Glass effects | `.glass` | Uses `--glass-alpha` |
| Focus rings | `:focus-visible` | Uses `--cyan-bright` |

---

## 10. Verification Commands

### Console Commands
```javascript
// Check theme state
document.documentElement.getAttribute('data-theme');
document.documentElement.className;

// Check CSS variables
getComputedStyle(document.documentElement).getPropertyValue('--cyan-bright');
getComputedStyle(document.documentElement).getPropertyValue('--accent-color');

// Check localStorage
JSON.parse(localStorage.getItem('app-preferences'));

// Check SW status
navigator.serviceWorker.getRegistration().then(r => console.log(r?.scope || 'Not registered'));
```

### Visual Verification
1. Toggle theme in Settings → Should update within 1 second
2. Refresh page → Theme should persist
3. Navigate between routes → Header/footer should remain consistent
4. Check logo → Should display at correct size with glow effect

---

## 11. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PERTH SAVER THEME SYSTEM                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   [index.css]                    [tokens.ts]                        │
│       │                              │                              │
│       ├── @theme { }                 ├── tokens.colors              │
│       │   └─ Tailwind colors         │   └─ TypeScript palette      │
│       │                              │                              │
│       ├── :root { }                  ├── tokens.typography          │
│       │   └─ CSS variables           │   └─ Font styles             │
│       │                              │                              │
│       └── .classes                   └── generateCSSVariables()     │
│           └─ Component styles            └─ Runtime injection       │
│                   │                              │                  │
│                   ▼                              ▼                  │
│           ┌─────────────────────────────────────────┐               │
│           │       AppPreferencesContext             │               │
│           │                                          │               │
│           │  ┌───────────┐    ┌─────────────────┐   │               │
│           │  │ useState  │◄───│  localStorage   │   │               │
│           │  │preferences│    │ app-preferences │   │               │
│           │  └─────┬─────┘    └─────────────────┘   │               │
│           │        │                                 │               │
│           │        ▼                                 │               │
│           │  applyPreferences()                      │               │
│           │        │                                 │               │
│           │        ▼                                 │               │
│           │  document.documentElement                │               │
│           │  ├─ data-theme="dark"                    │               │
│           │  ├─ class="light" (optional)             │               │
│           │  └─ style="--accent-color:..."           │               │
│           └─────────────────────────────────────────┘               │
│                           │                                          │
│                           ▼                                          │
│           ┌─────────────────────────────────────────┐               │
│           │           Components                     │               │
│           │                                          │               │
│           │  • Button: className="btn-cinematic"     │               │
│           │  • Card: className="card-dark"           │               │
│           │  • Glass: className="glass"              │               │
│           │  • Glow: className="glow-cyan"           │               │
│           │  • Logo: className="perth-saver-logo"    │               │
│           └─────────────────────────────────────────┘               │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 12. Troubleshooting

### Theme Not Updating
1. Check browser DevTools → Network → Disable cache
2. Run `localStorage.clear()` in console
3. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
4. Check SW status: If active in dev, unregister it

### Inconsistent Styling Between Routes
1. Verify all routes use `bg-obsidian` not hardcoded `bg-[#050505]`
2. Check if page is missing Layout wrapper
3. Verify CSS file is imported correctly

### Logo Not Displaying
1. Check import path: `@assets/generated_images/metallic_piggy_bank_coin_logo.png`
2. Verify file exists in `client/attached_assets/generated_images/`
3. Check console for 404 errors

### Service Worker Issues
1. In dev: SW should NOT be registered
2. In production: Check CACHE_VERSION in sw.js
3. Force unregister: `navigator.serviceWorker.getRegistrations().then(r => r.forEach(r => r.unregister()))`

---

**Last Updated**: 2025-11-29
**Token Version**: v7.0.1
**Cache Version**: 22
