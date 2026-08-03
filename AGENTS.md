# AGENTS.md — QR Restaurant Ordering System Development Guidelines

## Project Overview
This project (`qr-restaurant` / `Savour OS`) is a 3-surface real-time table-side ordering system consisting of:
1. **Customer Menu** (`/menu/:tableId` or `?view=customer&table=T-04`): Mobile-first dining menu with dark chalkboard theme, sticky category pills, ticket drawer, and live order tracking.
2. **Kitchen Display System (KDS)** (`/kitchen` or `?view=kitchen`): Landscape tablet/TV card board for chefs with color-coded elapsed ticket timers and audio/visual alerts.
3. **Admin Dashboard** (`/admin` or `?view=admin`): Overview analytics, date-range filters, menu availability toggles, and table QR code generator.

## Core Rules & Technical Standards
- **Single Source of Truth**: All surfaces consume and emit events against shared Firestore collections (`tables`, `categories`, `menu_items`, `orders`, `staff`) with local BroadcastChannel sync fallback.
- **Design System Tokens**: Use CSS custom properties defined in `index.css`:
  - Chalkboard base: `--ink-900` (`#242220`), Card: `--ink-700` (`#332F2B`)
  - Primary text: `--chalk-100` (`#F4EFE6`), Secondary text: `--chalk-400` (`#B9B2A6`)
  - Accent Gold: `--gold-500` (`#D9A62E`), Accent Brick: `--brick-500` (`#B23A2E`), Sage dot: `--sage-500` (`#7A9471`)
  - Fonts: `Fraunces` for headers/titles, `Inter` for body/UI, `JetBrains Mono` for ticket paper stubs, order IDs, and KDS cards.
- **Strict Copy Rules**:
  - Use "ticket" instead of "cart"
  - Use "Send to kitchen" instead of "Place order"
  - Use "Sold out" instead of "86'd" or "Out of Stock"
  - Use "Ticket sent to the kitchen" for confirmation toasts
- **TypeScript**: Strict mode is enabled (`noImplicitAny`, exact interface typings). No `any` types.
- **Build Verification**: `npm run build` must compile cleanly without TypeScript or Vite bundle errors before any phase is complete.
