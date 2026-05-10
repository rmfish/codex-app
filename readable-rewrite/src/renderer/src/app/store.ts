import { create } from "zustand";
import type {
  AutomationRecord,
  AutomationSchedule,
  BrowserDomainKind,
  CreateThreadInput,
  DesktopBootstrapState,
  PersistedAppState,
  SettingsModel,
} from "@shared/app-model";
import { createSeedAppState, fallbackBootstrap } from "@shared/seed-data";
import {
  addBrowserDomain as addBrowserDomainState,
  appendMessage as appendMessageState,
  createThread as createThreadState,
  getPersistedStateCopy,
  removeBrowserDomain as removeBrowserDomainState,
  selectAutomation as selectAutomationState,
  selectThread as selectThreadState,
  togglePluginConnection as togglePluginConnectionState,
  updateAutomation as updateAutomationState,
  updateAutomationSchedule as updateAutomationScheduleState,
  updateSettingsSection as updateSettingsSectionState,
} from "@shared/state-ops";

const seedState = createSeedAppState();

type AppState = PersistedAppState & {
  bootstrap: DesktopBootstrapState;
  hydrated: boolean;
  syncing: boolean;
  lastError: string | null;
  setBootstrap: (bootstrap: DesktopBootstrapState) => void;
  hydrate: () => Promise<void>;
  createThread: (input?: CreateThreadInput) => Promise<void>;
  appendMessage: (
    threadId: string,
    message: { role: "user" | "assistant" | "tool"; content: string; meta?: string },
  ) => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
  selectAutomation: (automationId: string) => Promise<void>;
  togglePluginConnection: (pluginId: string) => Promise<void>;
  updateAutomation: (
    automationId: string,
    patch: Partial<AutomationRecord>,
  ) => Promise<void>;
  updateAutomationSchedule: (
    automationId: string,
    patch: Partial<AutomationSchedule>,
  ) => Promise<void>;
  updateSettings: <K extends keyof SettingsModel>(
    section: K,
    patch: Partial<SettingsModel[K]>,
  ) => Promise<void>;
  addBrowserDomain: (kind: BrowserDomainKind, value: string) => Promise<void>;
  removeBrowserDomain: (kind: BrowserDomainKind, value: string) => Promise<void>;
};

function formatError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function pickPersistedState(state: AppState): PersistedAppState {
  return getPersistedStateCopy({
    schemaVersion: state.schemaVersion,
    threads: state.threads,
    messagesByThread: state.messagesByThread,
    activity: state.activity,
    plugins: state.plugins,
    automations: state.automations,
    settings: state.settings,
    selectedThreadId: state.selectedThreadId,
    selectedAutomationId: state.selectedAutomationId,
  });
}

function getDesktopDataApi() {
  return window.desktopApi?.data;
}

export const useAppStore = create<AppState>((set, get) => {
  const applySnapshot = (
    snapshot: PersistedAppState,
    options: { hydrated?: boolean; syncing?: boolean; lastError?: string | null } = {},
  ) => {
    set({
      ...snapshot,
      hydrated: options.hydrated ?? true,
      syncing: options.syncing ?? false,
      lastError: options.lastError ?? null,
    });
  };

  const runMutation = async (
    optimistic: (state: PersistedAppState) => PersistedAppState,
    remote?: () => Promise<PersistedAppState>,
  ) => {
    const optimisticSnapshot = optimistic(pickPersistedState(get()));
    applySnapshot(optimisticSnapshot, { syncing: Boolean(remote) });

    if (!remote) {
      return;
    }

    try {
      const confirmedSnapshot = await remote();
      applySnapshot(confirmedSnapshot);
    } catch (error) {
      set({ syncing: false, lastError: formatError(error) });
    }
  };

  return {
    bootstrap: fallbackBootstrap,
    hydrated: false,
    syncing: false,
    lastError: null,
    ...seedState,
    setBootstrap: (bootstrap) => set({ bootstrap }),
    hydrate: async () => {
      set({ syncing: true, lastError: null });

      try {
        const snapshot =
          (await window.desktopApi?.data.getSnapshot()) ?? createSeedAppState();
        applySnapshot(snapshot);
      } catch (error) {
        applySnapshot(pickPersistedState(get()), {
          hydrated: true,
          syncing: false,
          lastError: formatError(error),
        });
      }
    },
    createThread: async (input) =>
      runMutation((state) => createThreadState(state, input), (() => {
        const dataApi = getDesktopDataApi();
        return dataApi ? () => dataApi.createThread(input) : undefined;
      })()),
    appendMessage: async (threadId, message) =>
      runMutation((state) => appendMessageState(state, threadId, message), (() => {
        const dataApi = getDesktopDataApi();
        return dataApi
          ? () => dataApi.appendMessage(threadId, message)
          : undefined;
      })()),
    selectThread: async (threadId) =>
      runMutation((state) => selectThreadState(state, threadId), (() => {
        const dataApi = getDesktopDataApi();
        return dataApi ? () => dataApi.selectThread(threadId) : undefined;
      })()),
    selectAutomation: async (automationId) =>
      runMutation((state) => selectAutomationState(state, automationId), (() => {
        const dataApi = getDesktopDataApi();
        return dataApi
          ? () => dataApi.selectAutomation(automationId)
          : undefined;
      })()),
    togglePluginConnection: async (pluginId) =>
      runMutation(
        (state) => togglePluginConnectionState(state, pluginId),
        (() => {
          const dataApi = getDesktopDataApi();
          return dataApi
            ? () => dataApi.togglePluginConnection(pluginId)
            : undefined;
        })(),
      ),
    updateAutomation: async (automationId, patch) =>
      runMutation((state) => updateAutomationState(state, automationId, patch), (() => {
        const dataApi = getDesktopDataApi();
        return dataApi
          ? () => dataApi.updateAutomation(automationId, patch)
          : undefined;
      })()),
    updateAutomationSchedule: async (automationId, patch) =>
      runMutation(
        (state) => updateAutomationScheduleState(state, automationId, patch),
        (() => {
          const dataApi = getDesktopDataApi();
          return dataApi
            ? () => dataApi.updateAutomationSchedule(automationId, patch)
            : undefined;
        })(),
      ),
    updateSettings: async (section, patch) =>
      runMutation((state) => updateSettingsSectionState(state, section, patch), (() => {
        const dataApi = getDesktopDataApi();
        return dataApi ? () => dataApi.updateSettings(section, patch) : undefined;
      })()),
    addBrowserDomain: async (kind, value) =>
      runMutation((state) => addBrowserDomainState(state, kind, value), (() => {
        const dataApi = getDesktopDataApi();
        return dataApi ? () => dataApi.addBrowserDomain(kind, value) : undefined;
      })()),
    removeBrowserDomain: async (kind, value) =>
      runMutation(
        (state) => removeBrowserDomainState(state, kind, value),
        (() => {
          const dataApi = getDesktopDataApi();
          return dataApi
            ? () => dataApi.removeBrowserDomain(kind, value)
            : undefined;
        })(),
      ),
  };
});

export function selectCurrentThread(state: AppState) {
  return state.threads.find((thread) => thread.id === state.selectedThreadId) ?? state.threads[0];
}

export function selectCurrentAutomation(state: AppState) {
  return (
    state.automations.find(
      (automation) => automation.id === state.selectedAutomationId,
    ) ?? state.automations[0]
  );
}

export function selectResolvedTheme(state: AppState): "light" | "dark" {
  const mode = state.settings.appearance.themeMode;
  return mode === "system" ? state.bootstrap.systemTheme : mode;
}
