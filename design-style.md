# 🎨 Design System & Style Guidelines

This document outlines the visual language, typography, color palette, and aesthetic philosophy of the portfolio. 

---

## 👁️ Aesthetic Philosophy

**"Hacker / Cybernetic meets Clean Minimalist"**
The design aims to evoke the feeling of an advanced, polished IDE or terminal while remaining highly legible, modern, and professional. It aggressively avoids generic layouts in favor of dynamic, data-dense interfaces with subtle micro-animations.

**Key Traits:**
- **Code as UI**: Frequent use of syntax highlighting paradigms (slashes `//`, angle brackets `< >`, braces `{ }`).
- **Precision**: Pixel-perfect grid alignments and sharp borders.
- **Motion**: Everything that enters the screen should reveal itself gracefully. Nothing simply "appears."

---

## 📗 Color Palette

The core palette relies on deep greens, crisp whites, and stark text contrast.

*These are often implemented as CSS variables (`--green`, `--surface`, etc.) scoped to individual wrappers to ensure modularity.*

| Role | Hex | Usage |
| :--- | :--- | :--- |
| **Primary Theme** | `#16a34a` (Green) | Emphasized text, primary buttons, syntax highlights. |
| **Accent Glow** | `#4ade80` (Light Green)| Hover states, box-shadow glows, scroll progress bars. |
| **Environment** | `#f7faf7` | Main page background (often layered with a subtle grid). |
| **Surfaces** | `#ffffff` | Foreground cards, floating panels. |
| **Secondary Surface** | `#eef4ee` | Hover states for rows, disabled inputs. |
| **Borders** | `#dce8dc` | Dividers, card strokes, structural lines. |
| **Primary Text** | `#0f1f12` | High contrast text, headers. |
| **Muted Text** | `#6b7f6e` | Subtitles, metadata, file path indicators. |

---

## 🔤 Typography

The typography leverages a dual-font system to contrast human-readable marketing copy with code-centric data.

### 1. Interface & Data: `JetBrains Mono`
- **Weights**: `300` (Light), `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
- **Usage**: Used for 90% of the UI. Buttons, paragraphs, pills, navbar links, and metadata. It enforces the "IDE" aesthetic.

### 2. Display Headings: `Syne`
- **Weights**: `700` (Bold), `800` (ExtraBold)
- **Usage**: Strictly reserved for massive `H1`/`H2` section headers and primary focal points to inject a sense of modern, brutalist graphic design into the layout. Tight letter spacing (`letter-spacing: -1.5px`) is often applied.

---

## 📐 Layout & Structural Patterns

### 1. The Grid Background
Most sections feature a fixed, subtle background pattern mimicking an engineering blueprint or canvas.
```css
background-image:
  linear-gradient(rgba(22,163,74,.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(22,163,74,.04) 1px, transparent 1px);
background-size: 48px 48px;
```

### 2. The Window Bar UI
Cards that display "code" or "data" often use a mockup macOS window bar to reinforce the developer theme.
- **Dots**: Red (`#ff5f56`), Yellow (`#ffbd2e`), Green (`#27c93f`)
- **Title**: usually a faux filename like `ACADEMIC_PROFILE.TS` in tiny, uppercase monospace.

### 3. Glass & Glow
Interactive elements often utilize subtle scaling (`transform: translateY(-2px)`) paired with a colored drop shadow `box-shadow: 0 8px 24px rgba(22,163,74,.3)` to create a floating, radioactive aesthetic when hovered.

---

## 🎬 Animation Guidelines

1. **Staggered Reveals**: Lists of items (skills, projects, education entries) must never appear simultaneously. They must stagger their entrance (`transition-delay: 50ms, 100ms, 150ms...`) as they slide up and fade in.
2. **Typewriting Effects**: Used for hero text and data loading. Often accompanied by a blinking cursor block `█` or `|`.
3. **Compile-in**: Contact and Project lists often use a localized setInterval to "type" out the values character by character when entering the screen, simulating a terminal boot sequence.
