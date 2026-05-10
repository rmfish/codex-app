import type {
  BrowserDomainKind,
  CreateMessageInput,
  CreateThreadInput,
  DesktopBootstrapState,
  PersistedAppState,
  SettingsModel,
} from "@shared/app-model";

type DesktopApi = {
  getBootstrapState: () => Promise<DesktopBootstrapState>;
  openExternal: (url: string) => Promise<void>;
  showApplicationMenu: (
    menuId: "file" | "edit" | "view" | "window" | "help",
    x: number,
    y: number,
  ) => Promise<void>;
  onThemeChanged: (callback: (theme: "light" | "dark") => void) => () => void;
  data: {
    getSnapshot: () => Promise<PersistedAppState>;
    createThread: (input?: CreateThreadInput) => Promise<PersistedAppState>;
    appendMessage: (
      threadId: string,
      message: CreateMessageInput,
    ) => Promise<PersistedAppState>;
    selectThread: (threadId: string) => Promise<PersistedAppState>;
    selectAutomation: (automationId: string) => Promise<PersistedAppState>;
    togglePluginConnection: (pluginId: string) => Promise<PersistedAppState>;
    updateAutomation: (
      automationId: string,
      patch: Record<string, unknown>,
    ) => Promise<PersistedAppState>;
    updateAutomationSchedule: (
      automationId: string,
      patch: Record<string, unknown>,
    ) => Promise<PersistedAppState>;
    updateSettings: <K extends keyof SettingsModel>(
      section: K,
      patch: Partial<SettingsModel[K]>,
    ) => Promise<PersistedAppState>;
    addBrowserDomain: (
      kind: BrowserDomainKind,
      value: string,
    ) => Promise<PersistedAppState>;
    removeBrowserDomain: (
      kind: BrowserDomainKind,
      value: string,
    ) => Promise<PersistedAppState>;
  };
};

declare global {
  interface Window {
    desktopApi?: DesktopApi;
  }
}

export {};
