import type {
  DesktopBootstrapState,
  PersistedAppState,
} from "./app-model";
import { APP_STATE_SCHEMA_VERSION } from "./app-model";

export const fallbackBootstrap: DesktopBootstrapState = {
  appName: "Codex Readable Rewrite",
  appVersion: "0.1.0-dev",
  isPackaged: false,
  platform: "browser",
  systemTheme: "dark",
  dataFilePath: "not-available",
};

export function createSeedAppState(): PersistedAppState {
  return {
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    threads: [
      {
        id: "thread-rewrite-plan",
        title: "Strict 1:1 Electron rewrite",
        workspace: "app-readable",
        branch: "rewrite/window-parity",
        status: "active",
        summary:
          "Rebuild the visible Electron window with readable code while preserving the original product shell.",
        updatedAt: "just now",
        tags: ["shell", "thread page", "parity"],
      },
      {
        id: "thread-plugin-audit",
        title: "Skills and plugins parity",
        workspace: "app-readable",
        branch: "analysis/sidebar-routes",
        status: "draft",
        summary:
          "Track how Skills, disabled Plugins, and connector pages map back to readable modules.",
        updatedAt: "12 min ago",
        tags: ["skills", "plugins", "navigation"],
      },
      {
        id: "thread-remote-control",
        title: "Remote control hardening",
        workspace: "security-lab",
        branch: "feature/connection-guardrails",
        status: "remote",
        summary:
          "Mirror the connection settings while keeping the preload bridge explicit and inspectable.",
        updatedAt: "48 min ago",
        tags: ["settings", "security", "ipc"],
      },
    ],
    messagesByThread: {
      "thread-rewrite-plan": [
        {
          id: "m1",
          role: "user",
          content:
            "Rewrite the decompiled Electron app into a readable project and keep the visible shell strictly 1:1 with the original window.",
        },
        {
          id: "m2",
          role: "assistant",
          content:
            "I created a new readable Electron workspace and rebuilt the main, preload, renderer, and shared-state boundaries so the app can be debugged without minified bundles.",
          meta: "desktop rewrite",
        },
        {
          id: "m3",
          role: "tool",
          content:
            "Recovered the original shell layout, route labels, tokenized CSS surfaces, and persisted desktop state boundaries from the extracted assets.",
          meta: "bundle scan",
        },
      ],
      "thread-plugin-audit": [
        {
          id: "m4",
          role: "assistant",
          content:
            "The extracted sidebar confirms visible Skills navigation, a disabled Plugins state, and a dedicated Automations route in Electron.",
        },
      ],
      "thread-remote-control": [
        {
          id: "m5",
          role: "assistant",
          content:
            "Remote connection settings mention enabling remote control on this computer and allowing other signed-in clients to connect.",
        },
      ],
    },
    activity: [
      {
        id: "a1",
        kind: "tool",
        title: "Mapped app-shell structure",
        detail:
          "Recovered the left sidebar, top toolbar, and right-panel arrangement from the extracted Electron shell bundle.",
        timestamp: "just now",
      },
      {
        id: "a2",
        kind: "file",
        title: "Copied original theme tokens",
        detail:
          "Imported the original app-main and app-shell CSS so the rewrite can inherit the real Codex surface styling.",
        timestamp: "5 min ago",
      },
      {
        id: "a3",
        kind: "system",
        title: "Kept secure preload boundaries",
        detail:
          "Context isolation stays enabled and renderer state persists through a narrow IPC bridge into the desktop store.",
        timestamp: "11 min ago",
      },
      {
        id: "a4",
        kind: "security",
        title: "Blocked unsafe navigation",
        detail:
          "External navigation is validated before opening and the local renderer stays inside the rewrite bundle.",
        timestamp: "19 min ago",
      },
    ],
    plugins: [
      {
        id: "github",
        name: "GitHub",
        category: "Engineering",
        description:
          "Pull requests, issues, and repository context recovered from the original connector surfaces.",
        status: "connected",
        transport: "oauth",
        scopes: ["repo", "pull_request", "issue_comment"],
        riskNote:
          "Connected apps should surface least-privilege scopes and an explicit revoke path.",
      },
      {
        id: "slack",
        name: "Slack",
        category: "Team workflow",
        description:
          "Message lookup, channel summaries, and workflow handoffs mirrored from the extracted app.",
        status: "available",
        transport: "oauth",
        scopes: ["channels:read", "chat:write"],
        riskNote:
          "Workspace integrations need clear visibility boundaries per team and channel.",
      },
      {
        id: "filesystem",
        name: "Workspace Tools",
        category: "Local",
        description:
          "Readable wrappers around file access and shell execution exposed through curated tool calls.",
        status: "connected",
        transport: "local",
        scopes: ["workspace-read", "workspace-write", "shell"],
        riskNote:
          "Local tools should stay constrained by approval policy and sandbox mode.",
      },
      {
        id: "notion",
        name: "Notion",
        category: "Knowledge",
        description:
          "Knowledge-base retrieval and notes sync reconstructed as an MCP-style connector.",
        status: "disabled",
        transport: "mcp",
        scopes: ["pages:read", "pages:write"],
        riskNote:
          "Knowledge systems need clear provenance when retrieved context is shown in a conversation.",
      },
    ],
    automations: [
      {
        id: "automation-rewrite-audit",
        name: "Bundle inventory refresh",
        workspace: "app-readable",
        status: "ACTIVE",
        prompt:
          "Scan the extracted bundles, update the route inventory, and summarize any newly discovered settings pages or security-sensitive IPC handlers.",
        notes:
          "Modeled after the extracted automations page and schedule editor so the rule state stays inspectable.",
        lastRun: "Today 09:15",
        nextRun: "Today 15:00",
        schedule: {
          mode: "weekdays",
          time: "15:00",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
          intervalHours: 6,
          intervalMinutes: 30,
          customRrule:
            "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=15;BYMINUTE=0",
        },
      },
      {
        id: "automation-plugin-review",
        name: "Plugin permission review",
        workspace: "security-lab",
        status: "PAUSED",
        prompt:
          "Compare connected plugins against the current approval policy and flag any connectors whose scopes exceed the intended use cases.",
        notes:
          "Readable connector cards make scope review much easier than the original minified bundles.",
        lastRun: "Yesterday 18:40",
        nextRun: "Paused",
        schedule: {
          mode: "weekly",
          time: "18:30",
          days: ["Fri"],
          intervalHours: 24,
          intervalMinutes: 60,
          customRrule: "FREQ=WEEKLY;BYDAY=FR;BYHOUR=18;BYMINUTE=30",
        },
      },
      {
        id: "automation-sandbox-check",
        name: "Sandbox drift check",
        workspace: "security-lab",
        status: "ACTIVE",
        prompt:
          "Verify that preload bridges remain narrow, sandbox defaults are unchanged, and unexpected navigation paths are still blocked.",
        notes:
          "The rewrite should keep security drift visible in the UI, not only in code review.",
        lastRun: "Today 08:00",
        nextRun: "In 2 hours",
        schedule: {
          mode: "interval",
          time: "08:00",
          days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          intervalHours: 2,
          intervalMinutes: 120,
          customRrule: "FREQ=HOURLY;INTERVAL=2",
        },
      },
    ],
    settings: {
      general: {
        workMode: "coding",
        defaultOpenTarget: "vscode",
        integratedTerminalShell: "powershell",
        localeOverride: null,
        popoutWindowHotkey: null,
        composerEnterBehavior: "enter",
        followUpBehavior: "queue",
        reviewDelivery: "inline",
        suggestedPromptsEnabled: true,
        notificationsTurnMode: "unfocused",
        notificationsPermissionsEnabled: true,
        notificationsQuestionsEnabled: true,
        preventSleepWhileRunning: false,
        externalAgentImportState: "idle",
        externalAgentImportLastImportedAt: null,
      },
      appearance: {
        themeMode: "system",
        usePointerCursors: true,
        uiFontSize: 14,
        codeFontSize: 12,
        fontSmoothing: true,
        petVisible: true,
        selectedPet: "Blossom",
        customPetFolder: "D:\\Develop\\source\\web\\app-readable\\readable-rewrite\\.pets",
      },
      agent: {
        approvalPolicy: "on-request",
        sandboxMode: "workspace-write",
        networkAccess: true,
        configScope: "project",
        configPath: ".codex\\config.toml",
        speed: "standard",
        dependenciesEnabled: true,
        dependencyBundleVersion: "2026.05.10",
        dependencyHealth: "healthy",
        showAutoReviewPermissions: true,
        showFullAccessPermissions: false,
        agentEnvironment: "windows-native",
      },
      account: {
        authMethod: "ChatGPT bearer token",
        email: "engineer@example.com",
        accountId: "acct_6Jv5A0",
        userId: "user_A1BW",
        plan: "Pro",
        browserToken: "Bearer eyJ...",
      },
      browserUse: {
        enabled: true,
        websiteApproval: "always-ask",
        downloadApproval: "always-ask",
        uploadApproval: "always-ask",
        historyApproval: "always-ask",
        annotationScreenshots: "necessary",
        allowedDomains: ["github.com", "docs.openai.com"],
        blockedDomains: ["accounts.example.org", "internal-payroll.local"],
        allowedDownloadDomains: ["objects.githubusercontent.com"],
        blockedDownloadDomains: ["internal-payroll.local"],
        allowedUploadDomains: ["files.slack.com"],
        blockedUploadDomains: ["dropbox.example.org"],
      },
      connections: {
        remoteControlEnabled: true,
        allowSignedInPeers: true,
        minVersion: "26.506.31421",
        lastHeartbeat: "Today 10:21",
        displayName: "rewrite-station",
        remoteEnvironments: [
          {
            id: "remote-rewrite-lab",
            name: "rewrite-lab",
            host: "10.0.8.44",
            platform: "Windows / x64",
            version: "26.506.31421",
            requiredVersion: "26.506.31421",
            availability: "online",
            lastSeen: "just now",
          },
          {
            id: "remote-staging-linux",
            name: "staging-linux",
            host: "10.0.14.7",
            platform: "Ubuntu / x64",
            version: "26.401.11820",
            requiredVersion: "26.506.31421",
            availability: "update-required",
            lastSeen: "14 min ago",
          },
          {
            id: "remote-offline-archive",
            name: "archive-node",
            host: "10.0.6.91",
            platform: "macOS / arm64",
            version: "26.506.31421",
            requiredVersion: "26.506.31421",
            availability: "offline",
            lastSeen: "Yesterday 22:10",
          },
        ],
      },
      worktrees: {
        defaultRoot: "D:\\Develop\\source\\web",
        autoDetect: true,
        protectDirtyWorktrees: true,
        autoCleanup: true,
        keepCount: 6,
        worktrees: [
          {
            id: "worktree-shell-parity",
            repository: "app-readable",
            branch: "rewrite/window-parity",
            path: "D:\\Develop\\source\\web\\app-readable\\readable-rewrite",
            status: "active",
            lastUsed: "just now",
            conversations: [
              "Strict 1:1 Electron rewrite",
              "Skills and plugins parity",
            ],
          },
          {
            id: "worktree-remote-guardrails",
            repository: "security-lab",
            branch: "feature/connection-guardrails",
            path: "D:\\Develop\\source\\web\\security-lab\\guardrails",
            status: "dirty",
            lastUsed: "48 min ago",
            conversations: ["Remote control hardening"],
          },
          {
            id: "worktree-old-audit",
            repository: "app-readable",
            branch: "analysis/sidebar-routes",
            path: "D:\\Develop\\source\\web\\app-readable\\sidebar-audit",
            status: "stale",
            lastUsed: "3 days ago",
            conversations: [],
          },
        ],
      },
      localEnvironments: {
        selectedWorkspaceId: "",
        workspaces: [
          {
            id: "workspace-app-readable",
            name: "app-readable",
            rootPath: "D:\\Develop\\source\\web\\app-readable",
            status: "ready",
            inheritedCount: 1,
            environment: {
              name: "Readable Rewrite",
              setup: {
                defaultCommand: "npm install && npm run typecheck",
                windowsCommand: "npm install; npm run typecheck",
                macosCommand: "npm install && npm run typecheck",
                linuxCommand: "npm install && npm run typecheck",
              },
              cleanup: {
                defaultCommand: "git clean -fd -- .cache",
                windowsCommand: "git clean -fd -- .cache",
                macosCommand: "git clean -fd -- .cache",
                linuxCommand: "git clean -fd -- .cache",
              },
              actions: [
                {
                  id: "action-run-preview",
                  name: "Run preview",
                  command: "npm run dev",
                  icon: "run",
                  platforms: ["windows", "macos", "linux"],
                },
                {
                  id: "action-test-rewrite",
                  name: "Run tests",
                  command: "npm run test",
                  icon: "test",
                  platforms: ["windows", "macos", "linux"],
                },
              ],
            },
          },
          {
            id: "workspace-security-lab",
            name: "security-lab",
            rootPath: "D:\\Develop\\source\\web\\security-lab",
            status: "warning",
            inheritedCount: 0,
            environment: {
              name: "Connection Guardrails",
              setup: {
                defaultCommand: "pnpm install && pnpm build",
                windowsCommand: "pnpm install; pnpm build",
                macosCommand: "pnpm install && pnpm build",
                linuxCommand: "pnpm install && pnpm build",
              },
              cleanup: {
                defaultCommand: "pnpm lint --fix",
                windowsCommand: "pnpm lint --fix",
                macosCommand: "pnpm lint --fix",
                linuxCommand: "pnpm lint --fix",
              },
              actions: [
                {
                  id: "action-debug-policy",
                  name: "Debug policy",
                  command: "pnpm test policy --watch",
                  icon: "debug",
                  platforms: ["windows"],
                },
                {
                  id: "action-open-tools",
                  name: "Tooling smoke check",
                  command: "pnpm tools:check",
                  icon: "tool",
                  platforms: ["windows", "linux"],
                },
              ],
            },
          },
        ],
      },
    },
    selectedThreadId: "thread-rewrite-plan",
    selectedAutomationId: "automation-rewrite-audit",
  };
}
