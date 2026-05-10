# Reconstruction Notes

This rewrite is based on the extracted Electron bundles in the parent directory rather than on recovered original sources.

## Confirmed product surfaces from the bundles

- Main shell and sidebar: `webview/assets/app-shell-D05hyLrF.js`
- Root renderer bootstrap and route loading: `webview/assets/app-main-BssxuQ1L.js`
- Automations: `webview/assets/automations-page-CFQliMNR.js`
- Plugins and apps: `webview/assets/apps-Cel-9d-y.js`
- Account settings: `webview/assets/account-settings-CX6uYoxI.js`
- Agent settings: `webview/assets/agent-settings-DseV29Oe.js`
- Appearance settings: `webview/assets/appearance-settings-CfVU8wri.js`
- OAuth callback flow: `webview/assets/app-connect-oauth-callback-page-Z7SKB2vo.js`
- Main/preload Electron bootstrap: `.vite/build/bootstrap.js`, `.vite/build/main-DcB8P4Mu.js`, `.vite/build/preload.js`

## Confirmed security posture from the extracted main process

- `contextIsolation` was enabled.
- `nodeIntegration` was disabled.
- Several views ran with `sandbox: true`.
- Renderer access depended on a preload bridge and named IPC channels.

The rewrite keeps those same guardrails and narrows the IPC surface to an explicit allowlist.

## Current rewrite posture

- Renderer state is hydrated from a main-process JSON store instead of local-only mock objects.
- Shared state transitions live in `src/shared/state-ops.ts` so the same rules drive optimistic UI updates and persisted mutations.
- The data file path is exposed in the UI to make debugging and manual inspection straightforward.

## Route inventory recovered from lazy imports

- `appearance`
- `agent`
- `account`
- `plugins-settings`
- `skills-settings`
- `browser-use`
- `connections`
- `worktrees`
- `local-environments`
- `automations`
- `app-connect-oauth-callback`

The first implementation in this rewrite focuses on the highest-signal surfaces and keeps the architecture open for iterative parity work.
