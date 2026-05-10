import {
  APP_STATE_SCHEMA_VERSION,
  type ActivityItem,
  type AutomationRecord,
  type AutomationSchedule,
  type BrowserDomainKind,
  type CreateMessageInput,
  type CreateThreadInput,
  type PersistedAppState,
  type SettingsModel,
} from "./app-model";
import { createSeedAppState } from "./seed-data";

function clone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowLabel() {
  return new Date().toLocaleString();
}

function ensureSelection(state: PersistedAppState): PersistedAppState {
  const next = clone(state);

  if (!next.threads.some((thread) => thread.id === next.selectedThreadId)) {
    next.selectedThreadId = next.threads[0]?.id ?? "";
  }

  if (
    !next.automations.some(
      (automation) => automation.id === next.selectedAutomationId,
    )
  ) {
    next.selectedAutomationId = next.automations[0]?.id ?? "";
  }

  return next;
}

function prependActivity(
  state: PersistedAppState,
  item: Omit<ActivityItem, "id" | "timestamp">,
) {
  return [
    {
      id: createId("activity"),
      timestamp: nowLabel(),
      ...item,
    },
    ...state.activity,
  ].slice(0, 40);
}

export function getPersistedStateCopy(state: PersistedAppState) {
  return clone(state);
}

const browserDomainKeys: BrowserDomainKind[] = [
  "allowedDomains",
  "blockedDomains",
  "allowedDownloadDomains",
  "blockedDownloadDomains",
  "allowedUploadDomains",
  "blockedUploadDomains",
];

function normalizeAgentSettings(
  candidateAgent: Partial<SettingsModel["agent"]> | undefined,
  seedAgent: SettingsModel["agent"],
): SettingsModel["agent"] {
  const rawApproval = (candidateAgent as { approvalPolicy?: string } | undefined)
    ?.approvalPolicy;

  return {
    ...seedAgent,
    ...candidateAgent,
    approvalPolicy:
      rawApproval === "manual"
        ? "on-request"
        : rawApproval === "untrusted" ||
            rawApproval === "on-failure" ||
            rawApproval === "on-request" ||
            rawApproval === "never"
          ? rawApproval
          : seedAgent.approvalPolicy,
  };
}

function normalizeAccountSettings(
  candidateAccount: Partial<SettingsModel["account"]> | undefined,
  seedAccount: SettingsModel["account"],
): SettingsModel["account"] {
  const legacyToken = (candidateAccount as { tokenHint?: string } | undefined)
    ?.tokenHint;

  return {
    ...seedAccount,
    ...candidateAccount,
    browserToken: candidateAccount?.browserToken ?? legacyToken ?? seedAccount.browserToken,
  };
}

function normalizeBrowserUseSettings(
  candidateBrowserUse: Partial<SettingsModel["browserUse"]> | undefined,
  seedBrowserUse: SettingsModel["browserUse"],
): SettingsModel["browserUse"] {
  const rawApprovalMode = (
    candidateBrowserUse as { approvalMode?: string } | undefined
  )?.approvalMode;
  const rawAnnotationMode = (
    candidateBrowserUse as { annotationScreenshots?: string } | undefined
  )?.annotationScreenshots;

  const next: SettingsModel["browserUse"] = {
    ...seedBrowserUse,
    ...candidateBrowserUse,
    websiteApproval:
      candidateBrowserUse?.websiteApproval ??
      (rawApprovalMode === "allow-listed" ? "always-allow" : undefined) ??
      seedBrowserUse.websiteApproval,
    annotationScreenshots:
      rawAnnotationMode === "drag-only"
        ? "necessary"
        : candidateBrowserUse?.annotationScreenshots ?? seedBrowserUse.annotationScreenshots,
  };

  for (const key of browserDomainKeys) {
    next[key] = Array.isArray(candidateBrowserUse?.[key])
      ? clone(candidateBrowserUse[key])
      : seedBrowserUse[key];
  }

  return next;
}

function normalizeConnectionsSettings(
  candidateConnections: Partial<SettingsModel["connections"]> | undefined,
  seedConnections: SettingsModel["connections"],
): SettingsModel["connections"] {
  return {
    ...seedConnections,
    ...candidateConnections,
    remoteEnvironments: Array.isArray(candidateConnections?.remoteEnvironments)
      ? clone(candidateConnections.remoteEnvironments)
      : seedConnections.remoteEnvironments,
  };
}

function normalizeWorktreeSettings(
  candidateWorktrees: Partial<SettingsModel["worktrees"]> | undefined,
  seedWorktrees: SettingsModel["worktrees"],
): SettingsModel["worktrees"] {
  return {
    ...seedWorktrees,
    ...candidateWorktrees,
    worktrees: Array.isArray(candidateWorktrees?.worktrees)
      ? clone(candidateWorktrees.worktrees)
      : seedWorktrees.worktrees,
  };
}

function normalizeLocalEnvironmentsSettings(
  candidateLocalEnvironments:
    | Partial<SettingsModel["localEnvironments"]>
    | undefined,
  seedLocalEnvironments: SettingsModel["localEnvironments"],
): SettingsModel["localEnvironments"] {
  const requestedWorkspaceId =
    typeof candidateLocalEnvironments?.selectedWorkspaceId === "string"
      ? candidateLocalEnvironments.selectedWorkspaceId
      : seedLocalEnvironments.selectedWorkspaceId;

  const next = {
    ...seedLocalEnvironments,
    ...candidateLocalEnvironments,
    workspaces: Array.isArray(candidateLocalEnvironments?.workspaces)
      ? clone(candidateLocalEnvironments.workspaces)
      : seedLocalEnvironments.workspaces,
  };

  next.selectedWorkspaceId = next.workspaces.some(
    (workspace) => workspace.id === requestedWorkspaceId,
  )
    ? requestedWorkspaceId
    : "";

  return next;
}

export function normalizePersistedAppState(
  candidate: Partial<PersistedAppState> | PersistedAppState,
): PersistedAppState {
  const seed = createSeedAppState();

  const next: PersistedAppState = {
    schemaVersion: APP_STATE_SCHEMA_VERSION,
    threads: Array.isArray(candidate.threads) ? clone(candidate.threads) : seed.threads,
    messagesByThread:
      candidate.messagesByThread &&
      typeof candidate.messagesByThread === "object" &&
      !Array.isArray(candidate.messagesByThread)
        ? clone(candidate.messagesByThread)
        : seed.messagesByThread,
    activity: Array.isArray(candidate.activity)
      ? clone(candidate.activity)
      : seed.activity,
    plugins: Array.isArray(candidate.plugins) ? clone(candidate.plugins) : seed.plugins,
    automations: Array.isArray(candidate.automations)
      ? clone(candidate.automations)
      : seed.automations,
    settings:
      candidate.settings && typeof candidate.settings === "object"
        ? ({
            ...seed.settings,
            ...clone(candidate.settings),
            general: {
              ...seed.settings.general,
              ...candidate.settings.general,
            },
            appearance: {
              ...seed.settings.appearance,
              ...candidate.settings.appearance,
            },
            agent: normalizeAgentSettings(
              candidate.settings.agent,
              seed.settings.agent,
            ),
            account: normalizeAccountSettings(
              candidate.settings.account,
              seed.settings.account,
            ),
            browserUse: normalizeBrowserUseSettings(
              candidate.settings.browserUse,
              seed.settings.browserUse,
            ),
            connections: normalizeConnectionsSettings(
              candidate.settings.connections,
              seed.settings.connections,
            ),
            worktrees: normalizeWorktreeSettings(
              candidate.settings.worktrees,
              seed.settings.worktrees,
            ),
            localEnvironments: normalizeLocalEnvironmentsSettings(
              candidate.settings.localEnvironments,
              seed.settings.localEnvironments,
            ),
          } satisfies SettingsModel)
        : seed.settings,
    selectedThreadId:
      typeof candidate.selectedThreadId === "string"
        ? candidate.selectedThreadId
        : seed.selectedThreadId,
    selectedAutomationId:
      typeof candidate.selectedAutomationId === "string"
        ? candidate.selectedAutomationId
        : seed.selectedAutomationId,
  };

  return ensureSelection(next);
}

export function createThread(
  state: PersistedAppState,
  input: CreateThreadInput = {},
): PersistedAppState {
  const next = getPersistedStateCopy(state);
  const threadId = createId("thread");
  const thread = {
    id: threadId,
    title: input.title?.trim() || `Rewrite thread ${next.threads.length + 1}`,
    workspace: input.workspace?.trim() || "app-readable",
    branch:
      input.branch?.trim() ||
      `rewrite/${Math.random().toString(36).slice(2, 7)}`,
    status: input.status ?? "draft",
    summary:
      input.summary?.trim() ||
      "Track the next readable rewrite slice from recovered bundles to maintained source code.",
    updatedAt: nowLabel(),
    tags: input.tags?.length ? input.tags : ["rewrite", "debuggable"],
  };

  next.threads = [thread, ...next.threads];
  next.messagesByThread[threadId] = [];

  if (input.initialMessage?.trim()) {
    next.messagesByThread[threadId].push({
      id: createId("message"),
      role: "user",
      content: input.initialMessage.trim(),
    });
  }

  next.selectedThreadId = threadId;
  next.activity = prependActivity(next, {
    kind: "system",
    title: "Created a new rewrite thread",
    detail: `${thread.title} is now tracked in the persistent desktop store.`,
  });

  return ensureSelection(next);
}

export function appendMessage(
  state: PersistedAppState,
  threadId: string,
  message: CreateMessageInput,
): PersistedAppState {
  const content = message.content.trim();
  if (!content) {
    return getPersistedStateCopy(state);
  }

  const next = getPersistedStateCopy(state);
  const existing = next.messagesByThread[threadId] ?? [];
  next.messagesByThread[threadId] = [
    ...existing,
    {
      id: createId("message"),
      ...message,
      content,
    },
  ];

  next.threads = next.threads.map((thread) =>
    thread.id === threadId
      ? {
          ...thread,
          updatedAt: nowLabel(),
        }
      : thread,
  );

  next.activity = prependActivity(next, {
    kind: "tool",
    title: "Appended a conversation message",
    detail: `Stored a ${message.role} message for ${threadId}.`,
  });

  return ensureSelection(next);
}

export function selectThread(
  state: PersistedAppState,
  threadId: string,
): PersistedAppState {
  return ensureSelection({
    ...getPersistedStateCopy(state),
    selectedThreadId: threadId,
  });
}

export function selectAutomation(
  state: PersistedAppState,
  automationId: string,
): PersistedAppState {
  return ensureSelection({
    ...getPersistedStateCopy(state),
    selectedAutomationId: automationId,
  });
}

export function togglePluginConnection(
  state: PersistedAppState,
  pluginId: string,
): PersistedAppState {
  const next = getPersistedStateCopy(state);
  next.plugins = next.plugins.map((plugin) => {
    if (plugin.id !== pluginId) {
      return plugin;
    }

    return {
      ...plugin,
      status:
        plugin.status === "connected"
          ? "disabled"
          : plugin.status === "disabled"
            ? "available"
            : "connected",
    };
  });

  const plugin = next.plugins.find((item) => item.id === pluginId);
  if (plugin) {
    next.activity = prependActivity(next, {
      kind: "security",
      title: "Updated plugin trust state",
      detail: `${plugin.name} is now ${plugin.status}.`,
    });
  }

  return next;
}

export function updateAutomation(
  state: PersistedAppState,
  automationId: string,
  patch: Partial<AutomationRecord>,
): PersistedAppState {
  const next = getPersistedStateCopy(state);
  next.automations = next.automations.map((automation) =>
    automation.id === automationId ? { ...automation, ...patch } : automation,
  );

  const updated = next.automations.find((item) => item.id === automationId);
  if (updated) {
    next.activity = prependActivity(next, {
      kind: "file",
      title: "Updated automation details",
      detail: `${updated.name} now uses the readable rewrite data flow.`,
    });
  }

  return next;
}

export function updateAutomationSchedule(
  state: PersistedAppState,
  automationId: string,
  patch: Partial<AutomationSchedule>,
): PersistedAppState {
  const next = getPersistedStateCopy(state);
  next.automations = next.automations.map((automation) =>
    automation.id === automationId
      ? {
          ...automation,
          schedule: {
            ...automation.schedule,
            ...patch,
          },
        }
      : automation,
  );

  const updated = next.automations.find((item) => item.id === automationId);
  if (updated) {
    next.activity = prependActivity(next, {
      kind: "file",
      title: "Edited automation schedule",
      detail: `${updated.name} schedule changes were persisted through the main process.`,
    });
  }

  return next;
}

export function updateSettingsSection<K extends keyof SettingsModel>(
  state: PersistedAppState,
  section: K,
  patch: Partial<SettingsModel[K]>,
): PersistedAppState {
  const next = getPersistedStateCopy(state);
  next.settings = {
    ...next.settings,
    [section]: {
      ...next.settings[section],
      ...patch,
    },
  };

  next.activity = prependActivity(next, {
    kind: "system",
    title: "Saved settings changes",
    detail: `Updated the ${section} section in the persisted desktop state.`,
  });

  return next;
}

function normalizeDomainValue(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
}

export function addBrowserDomain(
  state: PersistedAppState,
  kind: BrowserDomainKind,
  value: string,
): PersistedAppState {
  const normalized = normalizeDomainValue(value);
  if (!normalized) {
    return getPersistedStateCopy(state);
  }

  const next = getPersistedStateCopy(state);
  const domains = next.settings.browserUse[kind];
  if (domains.includes(normalized)) {
    return next;
  }

  next.settings.browserUse = {
    ...next.settings.browserUse,
    [kind]: [...domains, normalized],
  };

  next.activity = prependActivity(next, {
    kind: "security",
    title: "Updated browser domain rules",
    detail: `Added ${normalized} to ${kind}.`,
  });

  return next;
}

export function removeBrowserDomain(
  state: PersistedAppState,
  kind: BrowserDomainKind,
  value: string,
): PersistedAppState {
  const next = getPersistedStateCopy(state);
  next.settings.browserUse = {
    ...next.settings.browserUse,
    [kind]: next.settings.browserUse[kind].filter((domain) => domain !== value),
  };

  next.activity = prependActivity(next, {
    kind: "security",
    title: "Removed browser domain rule",
    detail: `Removed ${value} from ${kind}.`,
  });

  return next;
}
