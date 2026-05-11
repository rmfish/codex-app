import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { selectResolvedTheme, useAppStore } from "@/app/store";
import type { DesktopBootstrapState } from "@shared/app-model";
import { fallbackBootstrap } from "@shared/seed-data";

function detectPreviewPlatform(): DesktopBootstrapState["platform"] {
  if (typeof navigator === "undefined") {
    return fallbackBootstrap.platform;
  }

  const source = `${navigator.userAgent} ${navigator.platform}`.toLowerCase();
  if (source.includes("windows")) {
    return "win32";
  }

  if (source.includes("mac")) {
    return "darwin";
  }

  if (source.includes("linux")) {
    return "linux";
  }

  return fallbackBootstrap.platform;
}

function getPreviewBootstrap(): DesktopBootstrapState {
  return {
    ...fallbackBootstrap,
    platform: detectPreviewPlatform(),
    systemTheme:
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
  };
}

export function App() {
  const setBootstrap = useAppStore((state) => state.setBootstrap);
  const hydrate = useAppStore((state) => state.hydrate);
  const resolvedTheme = useAppStore(selectResolvedTheme);
  const platform = useAppStore((state) => state.bootstrap.platform);
  const appearance = useAppStore((state) => state.settings.appearance);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const [value] = await Promise.all([
        window.desktopApi?.getBootstrapState() ?? getPreviewBootstrap(),
        hydrate(),
      ]);

      if (active) {
        setBootstrap(value);
      }
    };

    void bootstrap();

    const unsubscribe =
      window.desktopApi?.onThemeChanged((theme) => {
        setBootstrap({
          ...useAppStore.getState().bootstrap,
          systemTheme: theme,
        });
      }) ?? (() => undefined);

    return () => {
      active = false;
      unsubscribe();
    };
  }, [hydrate, setBootstrap]);

  useEffect(() => {
    const root = document.documentElement;

    root.dataset.theme = resolvedTheme;
    root.dataset.codexWindowType = "electron";
    root.dataset.windowType = "electron";
    root.dataset.codexOs = String(platform ?? "unknown");
    root.classList.toggle("dark", resolvedTheme === "dark");
    root.classList.toggle("light", resolvedTheme === "light");
    root.classList.toggle("electron-dark", resolvedTheme === "dark");
    root.classList.toggle("electron-light", resolvedTheme === "light");

    root.style.setProperty("--vscode-font-size", `${appearance.uiFontSize}px`);
    root.style.setProperty("--vscode-chat-font-size", `${appearance.uiFontSize}px`);
    root.style.setProperty("--vscode-editor-font-size", `${appearance.codeFontSize}px`);
    root.style.setProperty("--vscode-chat-editor-font-size", `${appearance.codeFontSize}px`);
    root.style.setProperty(
      "--cursor-interaction",
      appearance.usePointerCursors ? "pointer" : "default",
    );

    if (appearance.fontSmoothing) {
      root.style.setProperty("-webkit-font-smoothing", "antialiased");
      root.style.setProperty("-moz-osx-font-smoothing", "grayscale");
    } else {
      root.style.setProperty("-webkit-font-smoothing", "auto");
      root.style.setProperty("-moz-osx-font-smoothing", "auto");
    }
  }, [appearance, platform, resolvedTheme]);

  return <RouterProvider router={router} />;
}
