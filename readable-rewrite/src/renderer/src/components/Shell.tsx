import type { MouseEvent } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectCurrentThread, useAppStore } from "@/app/store";
import {
  ClockIcon,
  CodexIcon,
  SearchIcon,
  SettingsIcon,
  SkillsIcon,
  PlusIcon,
} from "@/components/AppIcons";

const menuItems = ["File", "Edit", "View", "Window", "Help"] as const;

type NavItem = {
  key: string;
  label: string;
  icon: typeof CodexIcon;
  to: string;
  shortcut?: string;
  disabled?: boolean;
};

const primaryNav: NavItem[] = [
  { key: "new", label: "New chat", icon: PlusIcon, to: "/" },
  {
    key: "search",
    label: "Search chats",
    icon: SearchIcon,
    to: "/",
    shortcut: "CmdOrCtrl+G",
  },
  { key: "skills", label: "Skills", icon: SkillsIcon, to: "/skills" },
  { key: "plugins", label: "Plugins", icon: CodexIcon, to: "/plugins", disabled: true },
  {
    key: "automations",
    label: "Automations",
    icon: ClockIcon,
    to: "/automations",
  },
];

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatThreadLabel(timestamp: string) {
  return timestamp.replace(/\s+/g, " ").trim();
}

function formatShortcutLabel(
  platform: string,
  shortcut: string | undefined,
) {
  if (!shortcut) {
    return null;
  }

  return shortcut.replace(
    "CmdOrCtrl",
    platform === "darwin" || platform === "macOS" ? "Cmd" : "Ctrl",
  );
}

export function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const bootstrap = useAppStore((state) => state.bootstrap);
  const threads = useAppStore((state) => state.threads);
  const selectThread = useAppStore((state) => state.selectThread);
  const currentThread = useAppStore(selectCurrentThread);
  const workspaces = useAppStore((state) => state.settings.localEnvironments.workspaces);
  const primaryWorkspace = workspaces[0];

  const isWindowsMenuBarVisible =
    bootstrap.platform === "win32" || bootstrap.platform === "windows";

  const showMenu = async (
    menuId: "file" | "edit" | "view" | "window" | "help",
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    await window.desktopApi?.showApplicationMenu(
      menuId,
      Math.round(event.currentTarget.getBoundingClientRect().left),
      Math.round(event.currentTarget.getBoundingClientRect().bottom),
    );
  };

  return (
    <div
      className="relative flex h-full flex-col"
      style={{
        width: "calc(100vw / var(--codex-window-zoom))",
        height: "calc(100vh / var(--codex-window-zoom))",
        zoom: "var(--codex-window-zoom)",
      }}
    >
      {isWindowsMenuBarVisible ? (
        <div className="app-header-tint draggable group/windows-top-bar z-40 flex h-toolbar-sm items-center ps-(--spacing-token-safe-header-left) pe-(--spacing-token-safe-header-right)">
          <div className="flex items-center gap-0.5 pr-2 pl-1" aria-label="Application menu">
            {menuItems.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-md border border-transparent px-2.5 py-1 text-base font-normal leading-none text-token-text-tertiary outline-none transition-colors hover:bg-token-foreground/5 hover:text-token-description-foreground focus-visible:bg-token-foreground/5 focus-visible:text-token-description-foreground"
                onClick={(event) => {
                  void showMenu(item.toLowerCase() as Lowercase<typeof item>, event);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="relative flex max-h-full min-h-0 w-full flex-1">
        <aside className="window-fx-sidebar-surface relative flex w-token-sidebar shrink-0 flex-col overflow-visible border-r border-token-border">
          <div className="draggable h-toolbar w-full" />

          <div className="flex min-h-0 flex-1 flex-col">
            <nav className="shrink-0 px-row-x" aria-label="Sidebar">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-0.5">
                  {primaryNav.map(({ disabled, icon: Icon, key, label, shortcut, to }) => {
                    const shortcutLabel = formatShortcutLabel(
                      String(bootstrap.platform ?? ""),
                      shortcut,
                    );

                    if (disabled) {
                      return (
                        <button
                          key={key}
                          type="button"
                          className="group relative flex w-full items-center gap-2 rounded-lg px-row-x py-row-y text-base text-token-text-secondary opacity-50 outline-none"
                          disabled
                          title="Please sign in with ChatGPT to use plugins"
                        >
                          <span className="inline-flex items-center justify-center">
                            <Icon className="icon-sm text-token-foreground" />
                          </span>
                          <span className="truncate">{label}</span>
                        </button>
                      );
                    }

                    const onClick =
                      key === "new" || key === "search"
                        ? async () => navigate("/")
                        : undefined;

                    if (onClick) {
                      const isActive = key === "new" && location.pathname === "/";

                      return (
                        <button
                          key={key}
                          type="button"
                          className={clsx(
                            "group relative flex w-full items-center gap-2 rounded-lg px-row-x py-row-y text-base outline-none",
                            "cursor-interaction text-token-text-secondary hover:bg-token-list-hover-background focus-visible:ring-token-focus focus-visible:ring-1 electron:opacity-75",
                            isActive &&
                              "bg-token-list-active-selection-background text-token-list-active-selection-foreground",
                          )}
                          onClick={() => {
                            void onClick();
                          }}
                        >
                          <span className="inline-flex items-center justify-center">
                            <Icon
                              className={clsx(
                                "icon-sm",
                                isActive
                                  ? "text-token-list-active-selection-icon-foreground"
                                  : "text-token-foreground",
                              )}
                            />
                          </span>
                          <span className="truncate">{label}</span>
                          {shortcutLabel ? (
                            <span className="ml-auto text-xs text-token-description-foreground">
                              {shortcutLabel}
                            </span>
                          ) : null}
                        </button>
                      );
                    }

                    return (
                      <NavLink
                        key={key}
                        to={to}
                        className={({ isActive }) =>
                          clsx(
                            "group relative flex w-full items-center gap-2 rounded-lg px-row-x py-row-y text-base outline-none",
                            "cursor-interaction text-token-text-secondary hover:bg-token-list-hover-background focus-visible:ring-token-focus focus-visible:ring-1 electron:opacity-75",
                            isActive &&
                              "bg-token-list-active-selection-background text-token-list-active-selection-foreground",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span className="inline-flex items-center justify-center">
                              <Icon
                                className={clsx(
                                  "icon-sm",
                                  isActive
                                    ? "text-token-list-active-selection-icon-foreground"
                                    : "text-token-foreground",
                                )}
                              />
                            </span>
                            <span className="truncate">{label}</span>
                            {shortcutLabel ? (
                              <span className="ml-auto text-xs text-token-description-foreground">
                                {shortcutLabel}
                              </span>
                            ) : null}
                          </>
                        )}
                      </NavLink>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-0.5">
                  <div className="px-row-x pt-2 text-sm text-token-description-foreground">
                    Projects
                  </div>
                  {primaryWorkspace ? (
                    <button
                      type="button"
                      className="group relative flex w-full items-center rounded-lg px-row-x py-row-y text-left text-base text-token-text-secondary outline-none transition-colors hover:bg-token-list-hover-background focus-visible:ring-token-focus focus-visible:ring-1 electron:opacity-75"
                    >
                      <span className="truncate text-token-text-primary">
                        {primaryWorkspace.name}
                      </span>
                    </button>
                  ) : null}
                </div>
              </div>
            </nav>

            <div className="flex min-h-0 flex-1 flex-col px-row-x pt-2">
              <div className="px-row-x text-sm text-token-description-foreground">Chats</div>
              <div className="scrollbar-stable mt-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
                {threads.map((thread) => {
                  const isActive = thread.id === currentThread.id;

                  return (
                    <button
                      key={thread.id}
                      type="button"
                      className={clsx(
                        "group flex w-full flex-col items-start rounded-lg px-row-x py-2 text-left outline-none transition-colors focus-visible:ring-token-focus focus-visible:ring-1 electron:opacity-75",
                        "cursor-interaction hover:bg-token-list-hover-background",
                        isActive &&
                          "bg-token-list-active-selection-background text-token-list-active-selection-foreground",
                      )}
                      onClick={() => {
                        navigate(`/thread/${thread.id}`);
                        void selectThread(thread.id);
                      }}
                    >
                      <span
                        className={clsx(
                          "w-full truncate text-sm",
                          isActive
                            ? "text-token-list-active-selection-foreground"
                            : "text-token-text-primary",
                        )}
                      >
                        {thread.title}
                      </span>
                      <span
                        className={clsx(
                          "text-xs",
                          isActive
                            ? "text-token-list-active-selection-foreground/80"
                            : "text-token-description-foreground",
                        )}
                      >
                        {formatThreadLabel(thread.updatedAt)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="shrink-0 px-row-x pb-2 pt-1">
              <NavLink
                to="/settings/general-settings"
                className={({ isActive }) =>
                  clsx(
                    "group relative flex w-full items-center gap-2 rounded-lg px-row-x py-row-y text-base outline-none",
                    "cursor-interaction text-token-text-secondary hover:bg-token-list-hover-background focus-visible:ring-token-focus focus-visible:ring-1 electron:opacity-75",
                    isActive &&
                      "bg-token-list-active-selection-background text-token-list-active-selection-foreground",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="inline-flex items-center justify-center">
                      <SettingsIcon
                        className={clsx(
                          "icon-sm",
                          isActive
                            ? "text-token-list-active-selection-icon-foreground"
                            : "text-token-foreground",
                        )}
                      />
                    </span>
                    <span className="truncate">Settings</span>
                  </>
                )}
              </NavLink>
            </div>
          </div>
        </aside>

        <main className="main-surface relative flex min-h-0 flex-1 flex-col rounded-s-2xl">
          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <div
              className="app-shell-main-content-viewport relative flex min-h-0 min-w-0 flex-1 flex-col"
              data-app-shell-main-content-layout="thread-edge-scroll"
            >
              <div className="app-shell-main-content-frame relative mt-(--app-shell-main-content-frame-top-offset) flex min-h-0 flex-1 flex-col border-t border-transparent">
                <div className="relative flex min-h-0 flex-1 overflow-hidden">
                  <div
                    aria-hidden="true"
                    data-app-shell-main-content-top-fade="hidden"
                    className="app-shell-main-content-top-fade pointer-events-none absolute inset-x-0 top-0 z-20 h-4 bg-gradient-to-b from-token-main-surface-primary opacity-0 transition-opacity duration-200 browser:hidden"
                  />
                  <div className="h-full min-h-0 min-w-0 flex-1">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
