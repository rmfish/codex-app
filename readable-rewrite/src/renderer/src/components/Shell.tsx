import type { MouseEvent } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectCurrentThread, useAppStore } from "@/app/store";
import { CodexIcon, SearchIcon, SettingsIcon, SkillsIcon, PlusIcon } from "@/components/AppIcons";

const menuItems = ["File", "Edit", "View", "Window", "Help"] as const;

type NavItem = {
  key: string;
  label: string;
  icon: typeof CodexIcon;
  to: string;
  disabled?: boolean;
};

const primaryNav: NavItem[] = [
  { key: "new", label: "New chat", icon: PlusIcon, to: "/" },
  { key: "search", label: "Search", icon: SearchIcon, to: "/" },
  { key: "skills", label: "Skills", icon: SkillsIcon, to: "/skills" },
  { key: "plugins", label: "Plugins", icon: CodexIcon, to: "/plugins", disabled: true },
  {
    key: "automations",
    label: "Automations",
    icon: CodexIcon,
    to: "/automations",
  },
];

function formatThreadLabel(timestamp: string) {
  return timestamp.replace(/\s+/g, " ").trim();
}

export function Shell() {
  const location = useLocation();
  const navigate = useNavigate();
  const bootstrap = useAppStore((state) => state.bootstrap);
  const threads = useAppStore((state) => state.threads);
  const selectThread = useAppStore((state) => state.selectThread);
  const currentThread = useAppStore(selectCurrentThread);

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
    <div className="codex-shell">
      {isWindowsMenuBarVisible ? (
        <header className="codex-menubar" aria-label="Application menu">
          <div className="codex-menubar__items">
            {menuItems.map((item) => (
              <button
                key={item}
                type="button"
                className="codex-menubar__item"
                onClick={(event) => {
                  void showMenu(item.toLowerCase() as Lowercase<typeof item>, event);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </header>
      ) : null}

      <div className="codex-shell__body">
        <aside className="window-fx-sidebar-surface codex-sidebar">
          <div className="codex-sidebar__top">
            {primaryNav.map(({ disabled, icon: Icon, key, label, to }) => {
              if (disabled) {
                return (
                  <button
                    key={key}
                    type="button"
                    className="codex-sidebar__row codex-sidebar__row--disabled"
                    disabled
                    title="Please sign in with ChatGPT to use plugins"
                  >
                    <span className="codex-sidebar__icon">
                      <Icon />
                    </span>
                    <span>{label}</span>
                  </button>
                );
              }

              const onClick = key === "new" ? async () => navigate("/") : undefined;

              if (onClick) {
                return (
                  <button
                    key={key}
                    type="button"
                    className={
                      location.pathname === "/"
                        ? "codex-sidebar__row codex-sidebar__row--active"
                        : "codex-sidebar__row"
                    }
                    onClick={() => {
                      void onClick();
                    }}
                  >
                    <span className="codex-sidebar__icon">
                      <Icon />
                    </span>
                    <span>{label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={key}
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? "codex-sidebar__row codex-sidebar__row--active"
                      : "codex-sidebar__row"
                  }
                >
                  <span className="codex-sidebar__icon">
                    <Icon />
                  </span>
                  <span>{label}</span>
                </NavLink>
              );
            })}
          </div>

          <div className="codex-sidebar__section codex-sidebar__section--fill">
            <div className="codex-thread-list">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  className={
                    thread.id === currentThread.id
                      ? "codex-thread-list__item codex-thread-list__item--active"
                      : "codex-thread-list__item"
                  }
                  onClick={() => {
                    navigate(`/thread/${thread.id}`);
                    void selectThread(thread.id);
                  }}
                >
                  <span className="codex-thread-list__title">{thread.title}</span>
                  <span className="codex-thread-list__meta">
                    {formatThreadLabel(thread.updatedAt)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="codex-sidebar__footer">
            <NavLink
              to="/settings/general-settings"
              className={({ isActive }) =>
                isActive
                  ? "codex-sidebar__row codex-sidebar__row--active"
                  : "codex-sidebar__row"
              }
            >
              <span className="codex-sidebar__icon">
                <SettingsIcon />
              </span>
              <span>Settings</span>
            </NavLink>
          </div>
        </aside>

        <main
          className="app-shell-main-content-viewport codex-main"
          data-app-shell-main-content-layout="thread-edge-scroll"
        >
          <div className="app-shell-main-content-frame main-surface codex-main__surface">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
