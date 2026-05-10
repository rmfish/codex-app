import { Navigate, NavLink, useNavigate, useParams } from "react-router-dom";
import { settingsSections } from "@/pages/settings/sections-rewrite";
import {
  AccountIcon,
  AgentNavIcon,
  AppearanceIcon,
  ArchivedChatsIcon,
  BackArrowIcon,
  BrowserSettingsIcon,
  BranchIcon,
  CursorIcon,
  ExternalArrowIcon,
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
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  external?: boolean;
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

function getVisibleSections() {
  const byId = new Map(settingsSections.map((section) => [section.id, section]));
  return navItems.flatMap((item) => {
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

function SettingsNavIcon({
  icon: Icon,
  className,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
}) {
  return <Icon className={className} />;
}

export function SettingsPage() {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const visibleSections = getVisibleSections();
  const groupedSections = groupVisibleSections(visibleSections);
  const currentId = sectionId ?? "general-settings";
  const currentSection = visibleSections.find(({ section }) => section.id === currentId);

  if (!sectionId) {
    return <Navigate replace to="/settings/general-settings" />;
  }

  if (!currentSection) {
    return <Navigate replace to="/settings/general-settings" />;
  }

  const CurrentComponent = currentSection.section.Component;

  return (
    <div className="settings-standalone">
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
            <div className="flex flex-col gap-4">
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
                  <div key={group.key} className="flex flex-col gap-0">
                    <div className="px-row-x py-1 text-sm text-token-description-foreground">
                      {group.heading}
                    </div>
                    {group.sections.map(({ item, section }) => (
                      <NavLink
                        key={section.id}
                        to={`/settings/${section.id}`}
                        className={({ isActive }) =>
                          clsx(
                            "focus-visible:outline-token-border relative flex w-full shrink-0 items-center gap-2 overflow-hidden rounded-lg px-row-x py-row-y text-left text-sm outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                            "h-token-nav-row cursor-interaction text-token-text-secondary hover:bg-token-list-hover-background",
                            isActive &&
                              "bg-token-list-hover-background text-token-list-active-selection-foreground",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <SettingsNavIcon
                              icon={item.icon}
                              className={clsx(
                                "icon-sm inline-block align-middle",
                                isActive
                                  ? "text-token-list-active-selection-icon-foreground"
                                  : "text-token-foreground",
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                            {item.external ? (
                              <ExternalArrowIcon className="icon-xs text-token-text-secondary opacity-50" />
                            ) : null}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </nav>
        </div>

        <div className="min-w-0 flex-1 overflow-visible">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
