import { contextBridge, ipcRenderer } from "electron";
import type {
  AutomationRecord,
  AutomationSchedule,
  BrowserDomainKind,
  CreateMessageInput,
  CreateThreadInput,
  DesktopBootstrapState,
  PersistedAppState,
  SettingsModel,
  WindowHotkeyState,
} from "../shared/app-model";
import { desktopChannels } from "../shared/ipc";

type DesktopDataApi = {
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
    patch: Partial<AutomationRecord>,
  ) => Promise<PersistedAppState>;
  updateAutomationSchedule: (
    automationId: string,
    patch: Partial<AutomationSchedule>,
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

type DesktopApi = {
  getBootstrapState: () => Promise<DesktopBootstrapState>;
  openExternal: (url: string) => Promise<void>;
  getWindowHotkeyState: () => Promise<WindowHotkeyState>;
  setWindowHotkey: (accelerator: string | null) => Promise<WindowHotkeyState>;
  clearWindowHotkey: () => Promise<WindowHotkeyState>;
  showApplicationMenu: (
    menuId: "file" | "edit" | "view" | "window" | "help",
    x: number,
    y: number,
  ) => Promise<void>;
  onThemeChanged: (callback: (theme: "light" | "dark") => void) => () => void;
  data: DesktopDataApi;
};

const desktopApi: DesktopApi = {
  getBootstrapState: () => ipcRenderer.invoke(desktopChannels.bootstrapState),
  openExternal: (url) => ipcRenderer.invoke(desktopChannels.openExternal, url),
  getWindowHotkeyState: () =>
    ipcRenderer.invoke(desktopChannels.getWindowHotkeyState),
  setWindowHotkey: (accelerator) =>
    ipcRenderer.invoke(desktopChannels.setWindowHotkey, accelerator),
  clearWindowHotkey: () =>
    ipcRenderer.invoke(desktopChannels.clearWindowHotkey),
  showApplicationMenu: (menuId, x, y) =>
    ipcRenderer.invoke(desktopChannels.showApplicationMenu, menuId, x, y),
  onThemeChanged: (callback) => {
    const listener = (
      _event: Electron.IpcRendererEvent,
      theme: "light" | "dark",
    ) => {
      callback(theme);
    };

    ipcRenderer.on(desktopChannels.themeChanged, listener);

    return () => {
      ipcRenderer.removeListener(desktopChannels.themeChanged, listener);
    };
  },
  data: {
    getSnapshot: () => ipcRenderer.invoke(desktopChannels.getSnapshot),
    createThread: (input) =>
      ipcRenderer.invoke(desktopChannels.createThread, input),
    appendMessage: (threadId, message) =>
      ipcRenderer.invoke(desktopChannels.appendMessage, threadId, message),
    selectThread: (threadId) =>
      ipcRenderer.invoke(desktopChannels.selectThread, threadId),
    selectAutomation: (automationId) =>
      ipcRenderer.invoke(desktopChannels.selectAutomation, automationId),
    togglePluginConnection: (pluginId) =>
      ipcRenderer.invoke(desktopChannels.togglePluginConnection, pluginId),
    updateAutomation: (automationId, patch) =>
      ipcRenderer.invoke(desktopChannels.updateAutomation, automationId, patch),
    updateAutomationSchedule: (automationId, patch) =>
      ipcRenderer.invoke(
        desktopChannels.updateAutomationSchedule,
        automationId,
        patch,
      ),
    updateSettings: (section, patch) =>
      ipcRenderer.invoke(desktopChannels.updateSettings, section, patch),
    addBrowserDomain: (kind, value) =>
      ipcRenderer.invoke(desktopChannels.addBrowserDomain, kind, value),
    removeBrowserDomain: (kind, value) =>
      ipcRenderer.invoke(desktopChannels.removeBrowserDomain, kind, value),
  },
};

contextBridge.exposeInMainWorld("desktopApi", desktopApi);
