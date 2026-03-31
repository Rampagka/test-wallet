# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Self-custodial TON testnet crypto wallet — a frontend-only web application (no backend). The app manages private keys directly in the browser and interacts with the TON blockchain via public testnet APIs.

## Commands

```bash
npm install --legacy-peer-deps  # install (required flag due to eslint-plugin-import + eslint 10)
npm run dev                     # dev server (Vite)
npm run build                   # type-check + production build
npm run build-only              # production build without type-check
npm run type-check              # vue-tsc type checking
npm run lint                    # oxlint + eslint with auto-fix
npm run format                  # prettier formatting
```

## Tech Stack

Vue 3.5 + TypeScript 6 + Vite 8 + Pinia 3 + Vue Router 5 + Tailwind CSS 4 (via `@tailwindcss/vite` plugin, no `tailwind.config` — uses `@theme inline` in `src/common/styles/global.css`) + Vuetify 4 (dark theme, component library for rapid UI development).

TON SDK: `@ton/ton` + `@ton/core` + `@ton/crypto`. Browser polyfills via `vite-plugin-node-polyfills` (Buffer).

## Design & UI

### Theme

Dark theme only (Tonkeeper-inspired). Custom color palette — not Tonkeeper's exact colors, but the same visual density and layout patterns. Vuetify's dark theme as base with custom overrides via Tailwind CSS variables.

### Layout

Mobile-first responsive design. Looks ideal on mobile (360-428px), stretches gracefully to desktop with `max-width` container. The app shell consists of:

```
┌─────────────────────┐
│     App Header      │  ← optional per-route header (or hidden)
├─────────────────────┤
│                     │
│    <router-view>    │  ← main content area, scrollable
│                     │
├─────────────────────┤
│      NavBar         │  ← fixed bottom navigation (only after wallet setup)
└─────────────────────┘
```

### NavBar

Fixed bottom navigation bar, visible only on authenticated routes (Dashboard, Send, Receive, Contacts). Hidden on onboarding routes (Welcome, Create, Import).

Module: `src/modules/nav-bar/` with its own components. Tabs: Dashboard (home), Send, Receive, Contacts (address book).

### Vuetify Setup

Vuetify is initialized in `src/core/plugins/vuetify.ts` and registered in `main.ts`. Uses `vite-plugin-vuetify` for automatic tree-shaking and component auto-import. Dark theme is set as default.

## Architecture

### Module System (`src/modules/`)

Each feature is a self-contained module with a strict enforced folder structure (via `eslint-plugin-project-structure`):

```
src/modules/{module-name}/
├── index.ts              # Public API (barrel export) — the ONLY entry point for external consumers
├── components/           # *.vue (kebab-case) + index.ts
├── composables/          # use{PascalCase}.ts
├── modals/               # {kebab-case}.vue
├── models/               # interfaces/, enums/, types/ subfolders
├── services/             # *.ts
├── helpers/              # *.ts
├── consts/               # *.ts
└── store/                # *.store.ts (Pinia stores)
```

### Current Modules

- **wallet** — Wallet creation (mnemonic generation), import (mnemonic validation), key management, wallet store with persistence
- **dashboard** — Main screen: balance display, address, transaction list with search, balance polling
- **send** — Send TON: form with address/amount validation, address poisoning detection, confirmation dialog, TX building & sending
- **receive** — Receive screen: full address display, copy to clipboard, QR code (bonus)
- **contacts** — Address book (CRUD), used for address poisoning protection UX
- **nav-bar** — Fixed bottom navigation bar (Dashboard, Send, Receive, Contacts tabs)

### Project Structure

```
src/
├── core/                       # App infrastructure
│   ├── router/
│   │   ├── index.ts            # Router instance + navigation guards
│   │   └── app-routes.ts       # All route definitions
│   └── configs/
│       └── eslint/             # ESLint configs (base, imports, module-structure)
├── common/                     # Cross-module shared code
│   ├── components/             # Reusable domain components (dumb)
│   ├── composables/            # Shared composables (useClipboard, usePolling, etc.)
│   ├── models/                 # Shared types/interfaces/enums
│   ├── services/               # Shared services (ton-client singleton)
│   ├── helpers/                # Shared utility functions (address formatting, etc.)
│   ├── ui/                     # UI primitives (always dumb: button-ui, input-ui, etc.)
│   └── styles/                 # global.css with Tailwind @theme
├── modules/                    # Feature modules (see Module System above)
├── pages/                      # Page components (smart, orchestrate modules)
├── App.vue                     # App shell with router-view
└── main.ts                     # Entry point (Buffer polyfill, plugins)
```

### Import Rules (ESLint-enforced)

- **Pages, App.vue, main.ts** → can only import modules via public API: `@/modules/{name}` (deep paths forbidden)
- **Inside a module** → use full alias paths `@/modules/{name}/...`, never the public API path `@/modules/{name}`
- **Relative parent imports** (`../`) are forbidden globally — use `@/` alias instead
- Cross-module imports → only through public API (`@/modules/название`)

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Import Order (Prettier-enforced)

Imports are auto-sorted by `@trivago/prettier-plugin-sort-imports`:
1. `@/core/` → 2. `@/pages/` → 3. `@/common/` → 4. `@/modules/*` (components, composables, modals, models, consts, helpers, services) → 5. Relative `../` → 6. Relative `./` → 7. Third-party

### Component Responsibility (Smart / Dumb)

- **`src/common/ui/`** — always dumb. Props/emit only, no logic.
- **`src/common/components/`** — dumb. Reusable components without store/router/modal dependencies.
- **Module components with suffix `-block`, `-card`, `-item`** — dumb. Data via props, events via emit.
- **Pages (`src/pages/`)** — always smart. Orchestrate modules, pass data down, handle events.
- **Composables** — extract reusable business logic (modals, store interaction) into composables, don't duplicate in components.

### Canonical Types (single source of truth)

Each type/interface is defined in exactly one place. Duplication is forbidden.
- **Shared types** (used across modules or in `common/`) → `src/common/models/types/`
- **Module types** (used only within one module) → `src/modules/{name}/models/types/`
- If a module type starts being used elsewhere — move to `src/common/models/types/` and re-export from the module

## Conventions

- Vue components: `kebab-case.vue`
- Composables: `use{PascalCase}.ts`
- Pinia stores: `{name}.store.ts`
- UI primitives in `src/common/ui/`
- Reusable domain components in `src/common/components/`
- All SVG icons are Vue SFC components using `currentColor` for dynamic coloring

## Commit Messages

Format: `type(scope): short description` (Conventional Commits). Always in English (Latin characters).

Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `perf`.

Scope — module or area (`wallet`, `send`, `dashboard`, `ui`, `core`). Description — concise and clear, what was done and why.

Do not add `Co-Authored-By` or other automatic signatures to commits.

---

## TON Integration Details

### Key Architectural Decisions

**Wallet version**: `WalletContractV5R1` — newest standard (used by Tonkeeper). For testnet: `networkGlobalId: -3`. V5R1 produces different addresses for testnet vs mainnet from the same mnemonic.

**API endpoint**: `https://testnet.toncenter.com/api/v2/jsonRPC` via `TonClient` from `@ton/ton`. Free API key from Telegram bot `@tontestnetapibot`. Without key — 1 req/sec limit.

**No TonConnect**: This app IS the wallet — it manages keys directly. TonConnect is for dApps connecting to external wallets.

**Mnemonic**: TON uses 24-word mnemonics (BIP-39 wordlist, TON-specific PBKDF2 derivation). Generated via `mnemonicNew()` from `@ton/crypto`.

**Key storage**: Mnemonic stored in localStorage via Pinia + `pinia-plugin-persistedstate` (acceptable for testnet assignment, noted as compromise in README).

**Wallet deployment**: TON wallets are smart contracts. First `sendTransfer` with `seqno=0` auto-deploys via `stateInit`. User must first receive TON via faucet.

### TON Client Singleton Pattern

```typescript
// common/services/ton-client.ts
import { TonClient } from '@ton/ton'

const client = new TonClient({
  endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
  apiKey: import.meta.env.VITE_TONCENTER_API_KEY || undefined,
})

export default client
```

### Wallet Service Core Flow

```typescript
import { mnemonicNew, mnemonicToPrivateKey, mnemonicValidate } from '@ton/crypto'
import { WalletContractV5R1, internal } from '@ton/ton'
import { toNano, fromNano } from '@ton/core'

// 1. Create wallet
const mnemonic = await mnemonicNew()                    // 24 words
const keyPair = await mnemonicToPrivateKey(mnemonic)
const wallet = WalletContractV5R1.create({
  publicKey: keyPair.publicKey,
  workchain: 0,
  walletId: { networkGlobalId: -3 },                   // testnet
})
const address = wallet.address.toString({ testOnly: true, bounceable: false })

// 2. Import wallet — same flow but with user-provided mnemonic
const isValid = await mnemonicValidate(userMnemonic)

// 3. Send TON
const contract = client.open(wallet)
const seqno = await contract.getSeqno()
await contract.sendTransfer({
  secretKey: keyPair.secretKey,
  seqno,
  messages: [internal({ to, value: toNano(amount), bounce: false })],
})

// 4. Balance & transactions
const balance = await client.getBalance(wallet.address)
const txs = await client.getTransactions(wallet.address, { limit: 20 })
```

### Address Poisoning Protection (mandatory feature)

Address poisoning — attack where attacker sends dust transactions from addresses visually similar to user's real contacts (matching prefix + suffix). User copies fake address from history.

Implementation:
1. **Similarity detection** — when entering recipient address, compare against address book and history. If prefix+suffix match but middle differs → warning
2. **Blocking modal** — not a toast, but a modal dialog with highlighted character differences, requiring explicit confirmation
3. **Full address on confirmation** — show full address without truncation on send confirmation screen
4. **Dust transaction marking** — mark suspicious micro-transactions in history (< 0.001 TON from unknown addresses)
5. **Address book** — so users don't rely on transaction history

### Warning Scenarios (send screen)

- Address poisoning (similar address found in history/contacts)
- Sending to bounceable address of uninitialized contract
- Sending entire balance (no remaining for fees)
- Sending to own address

### Testnet Resources

- **API endpoint**: `https://testnet.toncenter.com/api/v2/jsonRPC`
- **API key bot**: `@tontestnetapibot` (Telegram)
- **Faucet**: `@testgiver_ton_bot` (Telegram, 2 TON, 60min cooldown)
- **Explorer**: `https://testnet.tonscan.org/`

---

## Implementation Plan

### Phase 1: Project Foundation
- [x] Vite + Vue 3 + TypeScript scaffolding
- [x] Tailwind CSS 4 via `@tailwindcss/vite`
- [x] ESLint + Prettier + oxlint configs
- [x] Path aliases (`@/` → `src/`)
- [x] Module structure enforcement (`eslint-plugin-project-structure`)
- [x] TON dependencies (`@ton/ton`, `@ton/core`, `@ton/crypto`, `buffer`)
- [x] `vite-plugin-node-polyfills` for Buffer in browser
- [x] Router with `app-routes.ts` + navigation guards
- [x] Vuetify 4 + `vite-plugin-vuetify` + dark theme
- [ ] Vuetify plugin setup (`core/plugins/vuetify.ts`) with dark theme defaults
- [ ] Pinia with `pinia-plugin-persistedstate`
- [ ] Global styles (`common/styles/global.css` with `@theme inline`)
- [ ] App.vue layout shell: `<router-view>` + `<NavBar>` (conditional)
- [ ] NavBar module (`modules/nav-bar/`) — fixed bottom tabs: Dashboard, Send, Receive, Contacts

### Phase 2: Wallet Module (Create / Import)
- [ ] `wallet.service.ts` — createWallet(), importWallet(), getWalletAddress()
- [ ] `wallet.store.ts` — mnemonic, address, isInitialized (persisted)
- [ ] WalletPage (Welcome) — "Create New" / "Import Existing" choice
- [ ] CreateWalletPage — show 24-word mnemonic, "I saved it" confirmation
- [ ] ImportWalletPage — 24 input fields, mnemonicValidate(), error states

### Phase 3: Dashboard Module
- [ ] `ton-client.ts` singleton in `common/services/`
- [ ] `balance.service.ts` — getBalance() + polling (10-15s interval)
- [ ] `transaction.service.ts` — getTransactions(), parse direction/amount/comment
- [ ] DashboardPage — address, balance, Send/Receive buttons, transaction list
- [ ] Transaction list component with search, direction icons, dust marking

### Phase 4: Receive Module
- [ ] ReceivePage — full address display, copy button (Clipboard API)
- [ ] QR code (bonus — `qrcode` or `vue-qrcode` library)

### Phase 5: Send Module
- [ ] `send.service.ts` — sendTransaction(), waitForConfirmation(seqno)
- [ ] `address.ts` helper — isValidTonAddress(), isSimilarAddress(), highlightDifferences()
- [ ] SendPage — address/amount/comment fields, validation
- [ ] Confirmation modal — full address, amount, fee estimate
- [ ] Address poisoning warning modal with diff highlighting
- [ ] Loading state during send, success/error result

### Phase 6: Contacts Module
- [ ] `contacts.store.ts` — CRUD for { name, address, addedAt } (persisted)
- [ ] Simple contacts list with add/remove
- [ ] Contact selection when sending (optional)

### Phase 7: Polish
- [ ] Router guards (no wallet → Welcome, has wallet → Dashboard)
- [ ] Error handling (network errors, retry logic)
- [ ] Loading skeletons, snackbar notifications
- [ ] Responsive layout (mobile-first)
- [ ] README.md (setup, architecture, compromises, improvements)
