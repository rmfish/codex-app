import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  nativeTheme,
  globalShortcut,
  shell,
} from "electron";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  AutomationRecord,
  AutomationSchedule,
  BrowserDomainKind,
  CreateMessageInput,
  CreateThreadInput,
  DesktopBootstrapState,
  SettingsModel,
  WindowHotkeyState,
} from "../shared/app-model";
import { desktopChannels } from "../shared/ipc";
import {
  addBrowserDomain,
  appendMessage,
  createThread,
  removeBrowserDomain,
  selectAutomation,
  selectThread,
  togglePluginConnection,
  updateAutomation,
  updateAutomationSchedule,
  updateSettingsSection,
} from "../shared/state-ops";
import { AppDataStore } from "./data-store";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rendererEntry = join(__dirname, "../dist/index.html");
const preloadEntry = join(__dirname, "preload.js");
const devServerUrl = process.env.VITE_DEV_SERVER_URL;
const appVersion = app.getVersion();
const dataStore = new AppDataStore(join(app.getPath("userData"), "app-state.json"));
let currentWindowHotkey: string | null = null;

function resolveSystemTheme(): "light" | "dark" {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
}

function isSafeExternalUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ["https:", "http:", "mailto:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function getBootstrapState(): DesktopBootstrapState {
  return {
    appName: "Codex Readable Rewrite",
    appVersion,
    isPackaged: app.isPackaged,
    platform: process.platform,
    systemTheme: resolveSystemTheme(),
    dataFilePath: dataStore.getFilePath(),
  };
}

function broadcastTheme() {
  const windows = BrowserWindow.getAllWindows();
  const theme = resolveSystemTheme();

  for (const window of windows) {
    if (!window.isDestroyed()) {
      window.webContents.send(desktopChannels.themeChanged, theme);
    }
  }
}

function createMainWindow() {
  const window = new BrowserWindow({
    width: 1540,
    height: 980,
    minWidth: 1180,
    minHeight: 760,
    backgroundColor: "#081019",
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    webPreferences: {
      preload: preloadEntry,
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url);
    }

    return { action: "deny" };
  });

  window.webContents.on("will-navigate", (event, url) => {
    if (url !== window.webContents.getURL() && isSafeExternalUrl(url)) {
      event.preventDefault();
      void shell.openExternal(url);
    }
  });

  if (devServerUrl) {
    void window.loadURL(devServerUrl);
    window.webContents.openDevTools({ mode: "detach" });
  } else {
    void window.loadFile(rendererEntry);
  }

  return window;
}

function buildApplicationMenu(menuId: "file" | "edit" | "view" | "window" | "help") {
  switch (menuId) {
    case "file":
      return Menu.buildFromTemplate([
        { label: "New chat", click: () => undefined },
        { type: "separator" },
        { role: "close" },
      ]);
    case "edit":
      return Menu.buildFromTemplate([
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ]);
    case "view":
      return Menu.buildFromTemplate([
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ]);
    case "window":
      return Menu.buildFromTemplate([
        { role: "minimize" },
        { role: "zoom" },
        { role: "close" },
      ]);
    case "help":
      return Menu.buildFromTemplate([
        {
          label: "OpenAI",
          click: () => {
            void shell.openExternal("https://openai.com");
          },
        },
      ]);
  }
}

function normalizeAccelerator(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/\s+/g, "");
  return normalized.length > 0 ? normalized : null;
}

function getWindowHotkeyState(): WindowHotkeyState {
  return {
    supported: true,
    hotkey: currentWindowHotkey,
  };
}

function registerWindowHotkey(accelerator: string | null) {
  globalShortcut.unregisterAll();
  currentWindowHotkey = null;

  const normalized = normalizeAccelerator(accelerator);
  if (!normalized) {
    return getWindowHotkeyState();
  }

  const registered = globalShortcut.register(normalized, () => {
    const window = BrowserWindow.getAllWindows().find((entry) => !entry.isDestroyed());
    if (!window) {
      return;
    }

    if (window.isMinimized()) {
      window.restore();
    }

    window.show();
    window.focus();
  });

  if (!registered) {
    throw new Error(`Unable to register global shortcut: ${normalized}`);
  }

  currentWindowHotkey = normalized;
  return getWindowHotkeyState();
}

function registerIpcHandlers() {
  ipcMain.handle(desktopChannels.bootstrapState, () => getBootstrapState());
  ipcMain.handle(desktopChannels.openExternal, async (_event, target: string) => {
    if (!isSafeExternalUrl(target)) {
      throw new Error(`Blocked external URL: ${target}`);
    }

    await shell.openExternal(target);
  });
  ipcMain.handle(desktopChannels.getWindowHotkeyState, () => getWindowHotkeyState());
  ipcMain.handle(desktopChannels.setWindowHotkey, (_event, accelerator: string | null) =>
    registerWindowHotkey(accelerator),
  );
  ipcMain.handle(desktopChannels.clearWindowHotkey, () => registerWindowHotkey(null));
  ipcMain.handle(
    desktopChannels.showApplicationMenu,
    async (
      event,
      menuId: "file" | "edit" | "view" | "window" | "help",
      x: number,
      y: number,
    ) => {
      const menu = buildApplicationMenu(menuId);
      const window = BrowserWindow.fromWebContents(event.sender);

      if (!window) {
        return;
      }

      menu.popup({
        window,
        x,
        y,
      });
    },
  );
  ipcMain.handle(desktopChannels.getSnapshot, () => dataStore.getSnapshot());
  ipcMain.handle(
    desktopChannels.createThread,
    (_event, input: CreateThreadInput | undefined) =>
      dataStore.update((state) => createThread(state, input)),
  );
  ipcMain.handle(
    desktopChannels.appendMessage,
    (_event, threadId: string, message: CreateMessageInput) =>
      dataStore.update((state) => appendMessage(state, threadId, message)),
  );
  ipcMain.handle(desktopChannels.selectThread, (_event, threadId: string) =>
    dataStore.update((state) => selectThread(state, threadId)),
  );
  ipcMain.handle(
    desktopChannels.selectAutomation,
    (_event, automationId: string) =>
      dataStore.update((state) => selectAutomation(state, automationId)),
  );
  ipcMain.handle(
    desktopChannels.togglePluginConnection,
    (_event, pluginId: string) =>
      dataStore.update((state) => togglePluginConnection(state, pluginId)),
  );
  ipcMain.handle(
    desktopChannels.updateAutomation,
    (_event, automationId: string, patch: Partial<AutomationRecord>) =>
      dataStore.update((state) => updateAutomation(state, automationId, patch)),
  );
  ipcMain.handle(
    desktopChannels.updateAutomationSchedule,
    (_event, automationId: string, patch: Partial<AutomationSchedule>) =>
      dataStore.update((state) =>
        updateAutomationSchedule(state, automationId, patch),
      ),
  );
  ipcMain.handle(
    desktopChannels.updateSettings,
    (_event, section: keyof SettingsModel, patch: Record<string, unknown>) =>
      dataStore.update((state) =>
        updateSettingsSection(
          state,
          section,
          patch as Partial<SettingsModel[keyof SettingsModel]>,
        ),
      ),
  );
  ipcMain.handle(
    desktopChannels.addBrowserDomain,
    (_event, kind: BrowserDomainKind, value: string) =>
      dataStore.update((state) => addBrowserDomain(state, kind, value)),
  );
  ipcMain.handle(
    desktopChannels.removeBrowserDomain,
    (_event, kind: BrowserDomainKind, value: string) =>
      dataStore.update((state) => removeBrowserDomain(state, kind, value)),
  );
}

app.whenReady().then(() => {
  void dataStore
    .load()
    .then(async () => {
      try {
        const snapshot = await dataStore.getSnapshot();
        registerWindowHotkey(snapshot.settings.general.popoutWindowHotkey);
      } catch {
        currentWindowHotkey = null;
      }
    });
  registerIpcHandlers();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });

  nativeTheme.on("updated", broadcastTheme);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
