import type { ReactNode, SVGProps } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "@/app/store";
import { settingsSections } from "@/pages/settings/sections";
import {
  AccountIcon,
  AgentNavIcon,
  AppearanceIcon,
  ArchivedChatsIcon,
  BackArrowIcon,
  BrowserSettingsIcon,
  BranchIcon,
  CursorIcon,
  FaceIcon,
  GlobeIcon,
  HooksIcon,
  KeyboardShortcutsIcon,
  LocalEnvironmentsIcon,
  McpSettingsIcon,
  SettingsIcon,
  UsageIcon,
  WorktreeIcon,
} from "@/components/AppIcons";

type SettingsNavItem = {
  id: string;
  label: string;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  group: "app" | "host";
};

const navItems: SettingsNavItem[] = [
  { id: "general-settings", label: "General", icon: SettingsIcon, group: "app" },
  { id: "account", label: "Account", icon: AccountIcon, group: "app" },
  { id: "appearance", label: "Appearance", icon: AppearanceIcon, group: "app" },
  { id: "connections", label: "Connections", icon: GlobeIcon, group: "app" },
  { id: "git-settings", label: "Git", icon: BranchIcon, group: "app" },
  { id: "usage", label: "Usage", icon: UsageIcon, group: "app" },
  { id: "agent", label: "Configuration", icon: AgentNavIcon, group: "host" },
  { id: "personalization", label: "Personalization", icon: FaceIcon, group: "host" },
  {
    id: "keyboard-shortcuts",
    label: "Keyboard shortcuts",
    icon: KeyboardShortcutsIcon,
    group: "host",
  },
  { id: "mcp-settings", label: "MCP servers", icon: McpSettingsIcon, group: "host" },
  { id: "hooks-settings", label: "Hooks", icon: HooksIcon, group: "host" },
  { id: "browser-use", label: "Browser", icon: BrowserSettingsIcon, group: "host" },
  { id: "computer-use", label: "Computer use", icon: CursorIcon, group: "host" },
  {
    id: "local-environments",
    label: "Environments",
    icon: LocalEnvironmentsIcon,
    group: "host",
  },
  { id: "worktrees", label: "Worktrees", icon: WorktreeIcon, group: "host" },
  { id: "data-controls", label: "Archived chats", icon: ArchivedChatsIcon, group: "host" },
];

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SettingsNavGroup({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-0">
      {title ? (
        <div className="flex items-center justify-between gap-2 pr-0.5 pl-2">
          <div className="min-w-0 flex-1 text-base text-token-input-placeholder-foreground opacity-75">
            {title}
          </div>
        </div>
      ) : null}
      <div className="flex flex-col gap-px">{children}</div>
    </section>
  );
}

function getVisibleSections() {
  const byId = new Map(settingsSections.map((section) => [section.id, section]));
  const routedIds = new Set([
    "general-settings",
    "account",
    "appearance",
    "connections",
    "git-settings",
    "usage",
    "agent",
    "personalization",
    "keyboard-shortcuts",
    "mcp-settings",
    "hooks-settings",
    "browser-use",
    "computer-use",
    "local-environments",
    "worktrees",
    "data-controls",
  ]);

  return navItems.flatMap((item) => {
    if (!routedIds.has(item.id)) {
      return [];
    }

    const section = byId.get(item.id);
    return section ? [{ item, section }] : [];
  });
}

type VisibleSection = ReturnType<typeof getVisibleSections>[number];

function groupVisibleSections(visibleSections: VisibleSection[]) {
  const groups: Array<{
    key: "app" | "host";
    heading: string;
    sections: VisibleSection[];
  }> = [
    {
      key: "app",
      heading: "App",
      sections: visibleSections.filter(({ item }) => item.group === "app"),
    },
    {
      key: "host",
      heading: "Host",
      sections: visibleSections.filter(({ item }) => item.group === "host"),
    },
  ];

  return groups.filter((group) => group.sections.length > 0);
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const bootstrap = useAppStore((state) => state.bootstrap);
  const browserUseEnabled = useAppStore((state) => state.settings.browserUse.enabled);
  const visibleSections = getVisibleSections();
  const isWindows =
    bootstrap.platform === "win32" || bootstrap.platform === "windows";
  const isRemoteHost = false;
  const hasRemoteConnections = true;
  const hasUsageAccess = false;
  const hooksEnabled = false;
  const computerUseEnabled = false;
  const groupedSections = groupVisibleSections(
    visibleSections.filter(({ item }) => {
      switch (item.id) {
        case "account":
          return false;
        case "connections":
          return hasRemoteConnections && !isRemoteHost;
        case "usage":
          return hasUsageAccess;
        case "browser-use":
          return browserUseEnabled;
        case "computer-use":
          return computerUseEnabled;
        case "keyboard-shortcuts":
          return isWindows;
        case "hooks-settings":
          return hooksEnabled;
        default:
          return true;
      }
    }),
  );
  const currentId = sectionId ?? "general-settings";
  const currentSection = groupedSections
    .flatMap((group) => group.sections)
    .find(({ section }) => section.id === currentId);

  if (!sectionId) {
    return <Navigate replace to="/settings/general-settings" />;
  }

  if (!currentSection) {
    return <Navigate replace to="/settings/general-settings" />;
  }

  const CurrentComponent = currentSection.section.Component;

  return (
    <div
      className="flex h-full min-h-0"
      style={{
        width: "calc(100vw / var(--codex-window-zoom))",
        height: "calc(100vh / var(--codex-window-zoom))",
        zoom: "var(--codex-window-zoom)",
      }}
    >
      <div className="window-fx-sidebar-surface flex shrink-0 flex-col w-token-sidebar">
        <div className="draggable h-toolbar w-full" />

        <nav className="px-row-x" aria-label="Settings">
          <div className="flex flex-col">
            <div
              role="link"
              tabIndex={0}
              className={clsx(
                "group relative mb-2 flex w-full items-center rounded-lg px-row-x py-row-y text-base outline-none",
                "gap-2",
                "cursor-interaction text-token-text-secondary hover:bg-token-list-hover-background",
                "focus-visible:ring-token-focus focus-visible:ring-1 electron:opacity-75",
              )}
              onClick={() => {
                navigate("/", { replace: true });
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigate("/", { replace: true });
                }
              }}
            >
              <BackArrowIcon className="icon-xs" />
              <span>Back to app</span>
            </div>

            <div className="flex flex-col gap-4">
              {groupedSections.map((group) => (
                <SettingsNavGroup key={group.key} title={group.heading}>
                  {group.sections.map(({ item, section }) => (
                    <button
                      type="button"
                      key={section.id}
                      aria-current={section.id === currentId ? "page" : undefined}
                      className={clsx(
                        "focus-visible:outline-token-border relative flex h-token-nav-row w-full shrink-0 items-center gap-2 overflow-hidden rounded-lg px-row-x py-row-y text-left text-sm outline-none",
                        "cursor-interaction focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        section.id === currentId
                          ? "bg-token-list-hover-background text-token-list-active-selection-foreground"
                          : "hover:bg-token-list-hover-background",
                      )}
                      onClick={() => {
                        if (section.id !== currentId) {
                          navigate(`/settings/${section.id}`, { replace: true });
                        }
                      }}
                    >
                      <div
                        className={clsx(
                          "flex min-w-0 flex-1 items-center gap-2 text-base font-normal",
                          section.id === currentId
                            ? "text-token-list-active-selection-foreground"
                            : "text-token-foreground",
                        )}
                      >
                        <item.icon
                          className={clsx(
                            "icon-sm inline-block align-middle",
                            section.id === currentId
                              ? "text-token-list-active-selection-icon-foreground"
                              : "text-token-foreground",
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                    </button>
                  ))}
                </SettingsNavGroup>
              ))}
            </div>
          </div>
        </nav>
      </div>

      <div className="min-w-0 flex-1 overflow-visible">
        <CurrentComponent />
      </div>
    </div>
  );
}
