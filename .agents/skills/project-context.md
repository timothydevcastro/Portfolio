# 🚀 Portfolio Project Context

This document provides a comprehensive overview of the portfolio application architecture, technology stack, and core development principles. It serves as a single source of truth for anyone (human or AI) contributing to the codebase.

---

## 🏗️ Architecture & Stack

- **Framework**: React 18
- **Language**: TypeScript (`.tsx`, `.ts`)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Strictly scoped per component)
- **Deployment**: Single Page Application (SPA)

The project is a migration from separated raw HTML/CSS/JS files into a modular, unified React application.

---

## 📂 Project Structure

The project lives under `src/` and is divided into modular section components.

```text
src/
├── App.tsx                 # Main entry point; renders all sections sequentially and manages IntersectionObserver for scroll-spy navigation.
├── App.css                 # Global resets, base variables, and typography.
├── main.tsx                # React DOM render initialization.
├── Navbar.tsx / .css       # Fixed navigation bar tracking the active section.
├── HomeDevFinal.tsx        # Hero section with animated pill background.
├── AboutDevFinal.tsx       # About section with scroll-based typing animations.
├── SkillsDevFinal.tsx      # Skills tree with interactive canvas-based connection graph.
├── ProjectsDevFinal.tsx    # Projects grid with generative canvas backgrounds and hover reveals.
├── EducationDevFinal.tsx   # Education timeline and certifications with staggered reveals.
└── ContactDevFinal.tsx     # Contact section with Matrix-rain canvas and compile-in text effects.
```

---

## ⚙️ Core Engineering Principles

### 1. Strict CSS Scoping without CSS Modules
To avoid CSS bleeding from the original HTML files, a strict naming convention is enforced:
- **Every component is wrapped in a unique ID and ClassName**: e.g., `<div id="home" className="home-wrapper">`
- **All CSS rules MUST be prefixed** with this wrapper class: e.g., `.home-wrapper .heading { ... }`
- **Zero global styling pollution**: Global styles are strictly limited to `App.css` for typography (`JetBrains Mono`, `Syne`) and resets.

### 2. Bidirectional Observer Animations
Animations are driven by the Native `IntersectionObserver` API triggered on scroll.
- **Rule**: Animations must be **bidirectional**.
- When an element enters the viewport (`isIntersecting === true`), it receives a `.visible` class or triggers an effect.
- When an element leaves the viewport (`isIntersecting === false`), the `.visible` class must be removed, and JS-driven states (like typing effects or timeouts) must be reset. This ensures the site feels alive and sections re-animate every time the user scrolls back to them.

### 3. High-Performance Canvas Integrations
Several sections use HTML5 `<canvas>` for complex interactive backgrounds:
- **Contact Matrix Rain**: Renders falling characters dynamically.
- **Skills Graph**: Draws connecting lines between skill nodes on hover.
- **Projects Generative Patterns**: Renders localized canvas patterns unique to each project card.
- **Rule**: Canvas animations must correctly handle window `resize` events (scaling via `devicePixelRatio`) and clean up `requestAnimationFrame` or `setInterval` on component unmount to prevent memory leaks.

### 4. DOM Re-hydration Avoidance
Because the project heavily utilizes `useRef` and direct DOM manipulation for performance (Canvas, Observers), React state (`useState`) is kept to an absolute minimum within the sectional components to prevent unneeded re-renders that would disrupt ongoing animations. State is primarily only used in the parent `App.tsx` and `Navbar.tsx` for tracking navigation context.
