# Codex Readable Rewrite

This sub-project is a fresh Electron + React + TypeScript rewrite scaffold created from the extracted bundles in the parent directory.

## Goals

- Recover a readable and debuggable architecture.
- Preserve the original product shape: app shell, chats, plugins, automations, and settings.
- Reintroduce secure Electron defaults instead of depending on the extracted opaque bundles.
- Move mutable app state into the main process so the renderer stops depending on in-memory mock data.

## Commands

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run test
```

## Structure

- `src/main`: Electron main process with secure window creation and IPC allowlist.
- `src/main/data-store.ts`: Main-process JSON repository for threads, automations, plugins, and settings.
- `src/preload`: Narrow bridge exposed to the renderer.
- `src/renderer`: React UI rebuilt around the extracted navigation and feature inventory.
- `src/shared`: Shared types, IPC channels, seed data, and pure state transitions reused by main and renderer.
- `docs`: Reconstruction notes and source-to-feature mapping.
