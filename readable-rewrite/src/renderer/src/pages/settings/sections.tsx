import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  EverydayChatIcon,
  TerminalIcon,
} from "@/components/AppIcons";
import { useAppStore } from "@/app/store";
import type {
  AgentEnvironment,
  AgentReasoningSpeed,
  GeneralSettingsModel,
} from "@shared/app-model";

type SettingsSectionDefinition = {
  id: string;
  title: string;
  description: string;
  Component: () => ReactNode;
};

type Option<T extends string> = {
  value: T;
  label: string;
  description?: string;
};

const vscodeIconUrl = new URL(
  "../../../../../../asar-full/webview/apps/vscode.png",
  import.meta.url,
).href;

const integratedTerminalShellOptions: Option<GeneralSettingsModel["integratedTerminalShell"]>[] = [
  { value: "powershell", label: "PowerShell" },
  { value: "commandPrompt", label: "Command Prompt" },
  { value: "gitBash", label: "Git Bash" },
  { value: "wsl", label: "WSL" },
];

const agentEnvironmentOptions: Option<AgentEnvironment>[] = [
  {
    value: "windows-native",
    label: "Windows native",
    description: "Run the agent directly in Windows",
  },
  {
    value: "wsl",
    label: "Windows Subsystem for Linux",
    description: "Run the agent inside WSL",
  },
];

const speedOptions: Array<{
  value: AgentReasoningSpeed;
  label: string;
  description: string;
}> = [
  {
    value: "standard",
    label: "Standard",
    description: "Default speed",
  },
  {
    value: "fast",
    label: "Fast",
    description: "1.5x speed, increased plan usage",
  },
];

const supportedLocales = [
  "am",
  "ar",
  "bg-BG",
  "bn-BD",
  "bs-BA",
  "ca-ES",
  "cs-CZ",
  "da-DK",
  "de-DE",
  "el-GR",
  "es-419",
  "es-ES",
  "et-EE",
  "fa",
  "fi-FI",
  "fr-CA",
  "fr-FR",
  "gu-IN",
  "hi-IN",
  "hr-HR",
  "hu-HU",
  "hy-AM",
  "id-ID",
  "is-IS",
  "it-IT",
  "ja-JP",
  "ka-GE",
  "kk",
  "kn-IN",
  "ko-KR",
  "lt",
  "lv-LV",
  "mk-MK",
  "ml",
  "mn",
  "mr-IN",
  "ms-MY",
  "my-MM",
  "nb-NO",
  "nl-NL",
  "pa",
  "pl-PL",
  "pt-BR",
  "pt-PT",
  "ro-RO",
  "ru-RU",
  "sk-SK",
  "sl-SI",
  "so-SO",
  "sq-AL",
  "sr-RS",
  "sv-SE",
  "sw-TZ",
  "ta-IN",
  "te-IN",
  "th-TH",
  "tl",
  "tr-TR",
  "uk-UA",
  "ur",
  "vi-VN",
  "zh-CN",
  "zh-HK",
  "zh-TW",
] as const;

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function SettingsContentLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="main-surface flex h-full min-h-0 flex-col">
      <div className="draggable flex items-center px-panel electron:h-toolbar extension:h-toolbar-sm" />
      <div className="scrollbar-stable flex-1 overflow-y-auto p-panel">
        <div className="mx-auto flex w-full max-w-2xl flex-col electron:min-w-[calc(320px*var(--codex-window-zoom))]">
          <div className="flex items-center justify-between gap-3 pb-panel">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-panel">
              <div className="heading-base electron:heading-lg truncate">{title}</div>
            </div>
          </div>
          <div className="flex flex-col gap-[var(--padding-panel)]">{children}</div>
        </div>
      </div>
    </div>
  );
}

function SettingsGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={clsx("flex flex-col", className)}>{children}</section>;
}

function SettingsGroupHeader({
  title,
  subtitle,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
}) {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <div
      className={
        subtitle
          ? "flex items-start justify-between gap-2 px-0 pt-[calc((var(--height-toolbar)-1.5rem)/2)]"
          : "flex h-toolbar items-center justify-between gap-2 px-0 py-0"
      }
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <div className="text-base font-medium text-token-text-primary">{title}</div>
        ) : null}
        {subtitle ? (
          <div className="text-base font-normal text-token-text-tertiary">{subtitle}</div>
        ) : null}
      </div>
    </div>
  );
}

function SettingsGroupContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("flex flex-col gap-1.5", className)}>{children}</div>;
}

function SettingsSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "border-token-border flex flex-col divide-y-[0.5px] divide-token-border rounded-lg border",
        className,
      )}
      style={{ backgroundColor: "var(--color-background-panel, var(--color-token-bg-fog))" }}
    >
      {children}
    </div>
  );
}

function SettingsRow({
  label,
  description,
  control,
  className,
}: {
  label: ReactNode;
  description?: ReactNode;
  control: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "flex min-h-10 items-center justify-between gap-3 px-4 py-0.5 max-sm:min-h-0 max-sm:flex-col max-sm:items-stretch",
        className,
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <div className="min-w-0 text-sm text-token-text-primary">{label}</div>
        {description ? (
          <div className="text-token-text-secondary min-w-0 text-xs">{description}</div>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end max-sm:justify-stretch">
        {control}
      </div>
    </div>
  );
}

function SettingsToggle({
  checked,
  disabled = false,
  ariaLabel,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  ariaLabel: string;
  onChange: (checked: boolean) => void;
}) {
  const state = checked ? "checked" : "unchecked";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      data-state={state}
      disabled={disabled}
      className={clsx(
        "inline-flex items-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-token-focus-border focus-visible:rounded-full",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-interaction",
      )}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
    >
      <span
        className={clsx(
          "relative inline-flex h-5 w-8 shrink-0 items-center rounded-full transition-colors duration-200 ease-out",
          checked ? "bg-token-charts-blue" : "bg-token-foreground/10",
        )}
        data-state={state}
      >
        <span
          className={clsx(
            "h-4 w-4 rounded-full border border-[color:var(--gray-0)] bg-[color:var(--gray-0)] shadow-sm transition-transform duration-200 ease-out",
            checked ? "translate-x-[14px]" : "translate-x-[2px]",
          )}
          data-state={state}
        />
      </span>
    </button>
  );
}

function MenuTrigger({
  children,
  disabled = false,
  className,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "h-8 w-[240px] justify-between rounded-lg border border-token-border bg-token-bg-primary px-2.5 py-0 shadow-sm max-sm:w-full",
        "inline-flex items-center gap-0.5 text-sm text-token-text-primary",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-interaction",
        className,
      )}
      onClick={onClick}
    >
      <span className="flex min-w-0 flex-1 items-center gap-1.5">{children}</span>
      <ChevronDownIcon className="icon-2xs shrink-0 text-token-input-placeholder-foreground" />
    </button>
  );
}

function DropdownMenu<T extends string>({
  align = "end",
  children,
  contentClassName,
  disabled = false,
  open,
  onOpenChange,
  trigger,
}: {
  align?: "start" | "end";
  children: ReactNode;
  contentClassName?: string;
  disabled?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || disabled) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [disabled, onOpenChange, open]);

  return (
    <div className="settings-dropdown" ref={rootRef}>
      {trigger}
      {open && !disabled ? (
        <div
          role="menu"
          className={clsx(
            "settings-dropdown__menu",
            align === "end" ? "settings-dropdown__menu--end" : "settings-dropdown__menu--start",
            contentClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function DropdownItem({
  selected = false,
  disabled = false,
  onSelect,
  children,
}: {
  selected?: boolean;
  disabled?: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "settings-dropdown__item",
        selected && "settings-dropdown__item--selected",
        disabled && "settings-dropdown__item--disabled",
      )}
      onClick={onSelect}
    >
      <span className="min-w-0 flex-1">{children}</span>
      {selected ? <CheckIcon className="icon-xs shrink-0" /> : null}
    </button>
  );
}

function WorkModeCard({
  selected,
  title,
  description,
  icon: Icon,
  disabled = false,
  onSelect,
}: {
  selected: boolean;
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      className={clsx(
        "cursor-interaction flex min-h-[62px] min-w-0 items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-token-focus-border disabled:cursor-not-allowed disabled:opacity-70",
        selected
          ? "border-transparent bg-token-list-hover-background"
          : "border-token-border bg-token-main-surface-primary hover:bg-token-list-hover-background",
      )}
      onClick={onSelect}
    >
      <Icon className="size-5 shrink-0 text-token-icon-foreground" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="min-w-0 truncate text-sm text-token-text-primary">{title}</span>
        <span className="min-w-0 truncate text-sm text-token-text-secondary">{description}</span>
      </div>
      <span
        aria-hidden="true"
        className={clsx(
          "flex size-[17px] shrink-0 items-center justify-center rounded-full",
          selected
            ? "border-2 border-token-charts-blue bg-token-charts-blue"
            : "border border-token-description-foreground/40",
        )}
      >
        <span
          className={clsx(
            "size-[7px] rounded-full bg-[color:var(--gray-0)]",
            selected ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </button>
  );
}

function LabeledOption({
  icon,
  label,
}: {
  icon?: ReactNode;
  label: ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      <span className="truncate">{label}</span>
    </span>
  );
}

function SearchField({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      spellCheck={false}
      className="h-8 w-full rounded-lg border border-token-border bg-token-input-background px-2.5 text-sm text-token-text-primary shadow-sm outline-none placeholder:text-token-input-placeholder-foreground"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex h-8 items-center rounded-lg border border-token-border bg-token-bg-primary p-0.5 shadow-sm max-sm:w-full">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            className={clsx(
              "h-7 rounded-md px-3 text-sm transition-colors max-sm:flex-1",
              isSelected
                ? "bg-token-list-hover-background text-token-text-primary"
                : "text-token-text-secondary hover:text-token-text-primary",
            )}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function getLocaleLabel(locale: string, displayLocale: string) {
  try {
    return (
      new Intl.DisplayNames([displayLocale], {
        type: "language",
        languageDisplay: "standard",
      }).of(locale) ?? locale
    );
  } catch {
    return locale;
  }
}

function isMacPlatform(platform: string) {
  return platform === "darwin" || platform === "macOS";
}

function getModifierSymbol(platform: string) {
  return isMacPlatform(platform) ? "⌘" : "Ctrl";
}

function getShortcutLabel(platform: string, shortcut: "send" | "invert-follow-up") {
  if (isMacPlatform(platform)) {
    return shortcut === "send" ? "⌘+Enter" : "⌘+Shift+Enter";
  }

  return shortcut === "send" ? "Ctrl+Enter" : "Ctrl+Shift+Enter";
}

function getInvertFollowUpShortcutLabel(
  platform: string,
  enterBehavior: GeneralSettingsModel["composerEnterBehavior"],
) {
  return getShortcutLabel(
    platform,
    enterBehavior === "cmdIfMultiline" ? "send" : "invert-follow-up",
  );
}

function openExternalIfAvailable(url: string) {
  void window.desktopApi?.openExternal(url);
}

function ElevatedRiskLink({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex text-token-text-link-foreground"
      onClick={() => {
        openExternalIfAvailable("https://developers.openai.com/codex/config-basic");
      }}
    >
      {children}
    </button>
  );
}

function DefaultOpenDestinationSelect({
  value,
}: {
  value: GeneralSettingsModel["defaultOpenTarget"];
}) {
  const [open, setOpen] = useState(false);
  const option = {
    value,
    label: value === "vscode" ? "VS Code" : value,
    icon: vscodeIconUrl,
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      align="end"
      contentClassName="w-[220px]"
      trigger={
        <MenuTrigger className="menuFixed" onClick={() => setOpen((current) => !current)}>
          <LabeledOption
            icon={<img alt="" src={option.icon} className="icon-sm" />}
            label={option.label}
          />
        </MenuTrigger>
      }
    >
      <DropdownItem
        selected
        onSelect={() => {
          setOpen(false);
        }}
      >
        <LabeledOption
          icon={<img alt="" src={option.icon} className="icon-sm" />}
          label={option.label}
        />
      </DropdownItem>
    </DropdownMenu>
  );
}

function AgentEnvironmentSelect({
  value,
  initialValue,
  onChange,
}: {
  value: AgentEnvironment;
  initialValue: AgentEnvironment;
  onChange: (value: AgentEnvironment) => void;
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo<Option<AgentEnvironment>[]>(() => agentEnvironmentOptions, []);
  const selected = options.find((option) => option.value === value) ?? options[0];
  const initial = options.find((option) => option.value === initialValue) ?? selected;
  const showRestartNotice = initialValue !== value;

  return (
    <>
      {showRestartNotice ? (
        <div className="text-token-error-foreground text-xs">
          Restart Codex to apply this change. The agent is still running in {initial.label}.
        </div>
      ) : null}
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="w-[320px] max-w-xs space-y-1"
        trigger={
          <MenuTrigger onClick={() => setOpen((current) => !current)}>
            <LabeledOption label={selected.label} />
          </MenuTrigger>
        }
      >
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            selected={option.value === value}
            onSelect={() => {
              setOpen(false);
              onChange(option.value);
            }}
          >
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm">{option.label}</span>
              <span className="text-xs text-token-text-secondary">{option.description}</span>
            </div>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </>
  );
}

function IntegratedTerminalShellSelect({
  value,
  onChange,
}: {
  value: GeneralSettingsModel["integratedTerminalShell"];
  onChange: (value: GeneralSettingsModel["integratedTerminalShell"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const options = useMemo<Option<GeneralSettingsModel["integratedTerminalShell"]>[]>(
    () => integratedTerminalShellOptions,
    [],
  );
  const selected = options.find((option) => option.value === value) ?? options[0];

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      align="end"
      contentClassName="w-[220px] max-w-xs"
      trigger={
        <MenuTrigger onClick={() => setOpen((current) => !current)}>
          <LabeledOption label={selected.label} />
        </MenuTrigger>
      }
    >
      {options.map((option) => (
        <DropdownItem
          key={option.value}
          selected={option.value === value}
          onSelect={() => {
            setOpen(false);
            onChange(option.value);
          }}
        >
          <span className="text-sm">{option.label}</span>
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
}

function LanguageSelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const displayLocale =
    typeof navigator !== "undefined" && navigator.language ? navigator.language : "en-US";

  const options = useMemo(
    () =>
      supportedLocales
        .map((locale) => ({
          value: locale,
          label: getLocaleLabel(locale, locale),
          localizedLabel: getLocaleLabel(locale, displayLocale),
        }))
        .sort((left, right) => left.label.localeCompare(right.label)),
    [displayLocale],
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return options;
    }

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalizedQuery) ||
        option.localizedLabel.toLowerCase().includes(normalizedQuery),
    );
  }, [options, query]);

  const selected = options.find((option) => option.value === value) ?? null;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          setQuery("");
        }
      }}
      align="end"
      contentClassName="w-[320px] max-w-xs"
      trigger={
        <MenuTrigger onClick={() => setOpen((current) => !current)}>
          <LabeledOption label={selected?.label ?? "Auto Detect"} />
        </MenuTrigger>
      }
    >
      <div className="pb-1">
        <SearchField
          value={query}
          placeholder="Search languages"
          onChange={setQuery}
        />
      </div>
      <DropdownItem
        selected={value == null}
        onSelect={() => {
          setOpen(false);
          onChange(null);
        }}
      >
        <span className="text-sm">Auto Detect</span>
      </DropdownItem>
      <div className="max-h-80 overflow-y-auto">
        {filteredOptions.map((option) => (
          <DropdownItem
            key={option.value}
            selected={option.value === value}
            onSelect={() => {
              setOpen(false);
              onChange(option.value);
            }}
          >
            <span className="truncate text-sm">
              {option.label}
              {option.localizedLabel === option.label ? "" : ` • ${option.localizedLabel}`}
            </span>
          </DropdownItem>
        ))}
      </div>
    </DropdownMenu>
  );
}

function SpeedSelect({
  value,
  onChange,
}: {
  value: AgentReasoningSpeed;
  onChange: (value: AgentReasoningSpeed) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = speedOptions.find((option) => option.value === value) ?? speedOptions[0];

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      align="end"
      contentClassName="w-[320px] max-w-xs"
      trigger={
        <MenuTrigger onClick={() => setOpen((current) => !current)}>
          <LabeledOption label={selected.label} />
        </MenuTrigger>
      }
    >
      {speedOptions.map((option) => (
        <DropdownItem
          key={option.value}
          selected={option.value === value}
          onSelect={() => {
            setOpen(false);
            onChange(option.value);
          }}
        >
          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm">{option.label}</span>
            <span className="text-xs text-token-text-secondary">{option.description}</span>
          </div>
        </DropdownItem>
      ))}
    </DropdownMenu>
  );
}

function GeneralSection() {
  const general = useAppStore((state) => state.settings.general);
  const agent = useAppStore((state) => state.settings.agent);
  const platform = useAppStore((state) => state.bootstrap.platform);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const isWindows = platform === "win32" || platform === "windows";
  const modifierSymbol = getModifierSymbol(platform);
  const invertFollowUpShortcutLabel = getInvertFollowUpShortcutLabel(
    platform,
    general.composerEnterBehavior,
  );
  const initialAgentEnvironmentRef = useRef(agent.agentEnvironment);
  const showAgentEnvironment = isWindows;
  const showIntegratedTerminalShell = isWindows;
  const showPreventSleepWhileRunning = !isWindows;

  return (
    <SettingsContentLayout title="General">
      <SettingsGroup className="gap-4">
        <SettingsGroupHeader
          title="Work mode"
          subtitle="Choose how much technical detail Codex shows"
        />
        <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1" role="radiogroup" aria-label="Work mode">
          <WorkModeCard
            selected={general.workMode === "coding"}
            title="For coding"
            description="More technical responses and control"
            icon={TerminalIcon}
            onSelect={() => {
              void updateSettings("general", { workMode: "coding" });
            }}
          />
          <WorkModeCard
            selected={general.workMode === "everyday"}
            title="For everyday work"
            description="Same power, less technical detail"
            icon={EverydayChatIcon}
            onSelect={() => {
              void updateSettings("general", { workMode: "everyday" });
            }}
          />
        </div>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupHeader title="Permissions" />
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Default permissions"
              description="By default, Codex can read and edit files in its workspace. It can ask for additional access when needed"
              control={
                <SettingsToggle
                  checked
                  disabled
                  ariaLabel="Default permissions are always shown"
                  onChange={() => undefined}
                />
              }
            />
            <SettingsRow
              label="Auto-review"
              description={
                <>
                  Codex can read and edit files in its workspace. Codex automatically reviews requests for additional access. Auto-review can make mistakes.{" "}
                  <ElevatedRiskLink>Learn more</ElevatedRiskLink> about elevated risks.
                </>
              }
              control={
                <SettingsToggle
                  checked={agent.showAutoReviewPermissions}
                  ariaLabel="Show Auto-review in the composer"
                  onChange={(checked) => {
                    void updateSettings("agent", {
                      showAutoReviewPermissions: checked,
                    });
                  }}
                />
              }
            />
            <SettingsRow
              label="Full access"
              description={
                <>
                  When Codex runs with full access, it can edit any file on your computer and run commands with network, without your approval. This significantly increases the risk of data loss, leaks, or unexpected behavior.{" "}
                  <ElevatedRiskLink>Learn more</ElevatedRiskLink> about elevated risks.
                </>
              }
              control={
                <SettingsToggle
                  checked={agent.showFullAccessPermissions}
                  ariaLabel="Show Full access in the composer"
                  onChange={(checked) => {
                    void updateSettings("agent", {
                      showFullAccessPermissions: checked,
                    });
                  }}
                />
              }
            />
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupHeader title="General" />
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Default open destination"
              description="Where files and folders open by default"
              control={<DefaultOpenDestinationSelect value={general.defaultOpenTarget} />}
            />
            {showAgentEnvironment ? (
              <SettingsRow
                label="Agent environment"
                description="Choose where the agent runs on Windows"
                control={
                  <AgentEnvironmentSelect
                    value={agent.agentEnvironment}
                    initialValue={initialAgentEnvironmentRef.current}
                    onChange={(value) => {
                      void updateSettings("agent", { agentEnvironment: value });
                    }}
                  />
                }
              />
            ) : null}
            {showIntegratedTerminalShell ? (
              <SettingsRow
                label="Integrated terminal shell"
                description="Choose which shell opens in the integrated terminal."
                control={
                  <IntegratedTerminalShellSelect
                    value={general.integratedTerminalShell}
                    onChange={(value) => {
                      void updateSettings("general", {
                        integratedTerminalShell: value,
                      });
                    }}
                  />
                }
              />
            ) : null}
            <SettingsRow
              label="Language"
              description="Language for the app UI"
              control={
                <LanguageSelect
                  value={general.localeOverride}
                  onChange={(value) => {
                    void updateSettings("general", { localeOverride: value });
                  }}
                />
              }
            />
            <SettingsRow
              label={`Require ${modifierSymbol} + enter to send long prompts`}
              description={`When enabled, multiline prompts require ${modifierSymbol} + enter to send.`}
              control={
                <SettingsToggle
                  checked={general.composerEnterBehavior === "cmdIfMultiline"}
                  ariaLabel={`Require ${modifierSymbol} + enter to send long prompts`}
                  onChange={(checked) => {
                    void updateSettings("general", {
                      composerEnterBehavior: checked ? "cmdIfMultiline" : "enter",
                    });
                  }}
                />
              }
            />
            <SettingsRow
              label="Speed"
              description="Choose how quickly inference runs across chats, subagents, and compaction. Fast uses increased plan usage"
              control={
                <SpeedSelect
                  value={agent.speed}
                  onChange={(value) => {
                    void updateSettings("agent", { speed: value });
                  }}
                />
              }
            />
            <SettingsRow
              label="Follow-up behavior"
              description={`Queue follow-ups while Codex runs or steer the current run. Press ${invertFollowUpShortcutLabel} to do the opposite for one message`}
              className="gap-6"
              control={
                <SegmentedToggle
                  value={general.followUpBehavior}
                  options={[
                    { value: "queue", label: "Queue" },
                    { value: "steer", label: "Steer" },
                  ]}
                  onChange={(value) => {
                    void updateSettings("general", { followUpBehavior: value });
                  }}
                />
              }
            />
            <SettingsRow
              label="Code review"
              description="Start /review in the current chat when possible or launch a separate review chat"
              className="gap-6"
              control={
                <SegmentedToggle
                  value={general.reviewDelivery}
                  options={[
                    { value: "inline", label: "Inline" },
                    { value: "detached", label: "Detached" },
                  ]}
                  onChange={(value) => {
                    void updateSettings("general", { reviewDelivery: value });
                  }}
                />
              }
            />
            {showPreventSleepWhileRunning ? (
              <SettingsRow
                label="Prevent sleep while running"
                description="Keep your computer awake while Codex is running a chat"
                control={
                  <SettingsToggle
                    checked={general.preventSleepWhileRunning}
                    ariaLabel="Prevent sleep while running"
                    onChange={(checked) => {
                      void updateSettings("general", {
                        preventSleepWhileRunning: checked,
                      });
                    }}
                  />
                }
              />
            ) : null}
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>
    </SettingsContentLayout>
  );
}

function NotImplementedSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <SettingsContentLayout title={title}>
      <div className="settings-placeholder">
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </SettingsContentLayout>
  );
}

function AppearanceSection() {
  return (
    <NotImplementedSection
      title="Appearance"
      description="Appearance settings are still being reconstructed from the original bundles."
    />
  );
}

function ConfigurationSection() {
  return (
    <NotImplementedSection
      title="Configuration"
      description="Configuration settings are still being reconstructed from the original bundles."
    />
  );
}

function AccountSection() {
  return (
    <NotImplementedSection
      title="Account"
      description="Account settings are still being reconstructed from the original bundles."
    />
  );
}

function PersonalizationSection() {
  return (
    <NotImplementedSection
      title="Personalization"
      description="Personalization settings are still being reconstructed from the original bundles."
    />
  );
}

function McpServersSection() {
  return (
    <NotImplementedSection
      title="MCP servers"
      description="MCP settings are still being reconstructed from the original bundles."
    />
  );
}

function HooksSection() {
  return (
    <NotImplementedSection
      title="Hooks"
      description="Hooks settings are still being reconstructed from the original bundles."
    />
  );
}

function KeyboardShortcutsSection() {
  return (
    <NotImplementedSection
      title="Keyboard shortcuts"
      description="Keyboard shortcuts settings are still being reconstructed from the original bundles."
    />
  );
}

function GitSection() {
  return (
    <NotImplementedSection
      title="Git"
      description="Git settings are still being reconstructed from the original bundles."
    />
  );
}

function ConnectionsSection() {
  return (
    <NotImplementedSection
      title="Connections"
      description="Connection settings are still being reconstructed from the original bundles."
    />
  );
}

function UsageSection() {
  return (
    <NotImplementedSection
      title="Usage"
      description="Usage settings are still being reconstructed from the original bundles."
    />
  );
}

function EnvironmentsSection() {
  return (
    <NotImplementedSection
      title="Environments"
      description="Environment settings are still being reconstructed from the original bundles."
    />
  );
}

function WorktreesSection() {
  return (
    <NotImplementedSection
      title="Worktrees"
      description="Worktree settings are still being reconstructed from the original bundles."
    />
  );
}

function BrowserSection() {
  return (
    <NotImplementedSection
      title="Browser"
      description="Browser settings are still being reconstructed from the original bundles."
    />
  );
}

function ComputerUseSection() {
  return (
    <NotImplementedSection
      title="Computer use"
      description="Computer use settings are still being reconstructed from the original bundles."
    />
  );
}

function ArchivedChatsSection() {
  return (
    <NotImplementedSection
      title="Archived chats"
      description="Archived chat settings are still being reconstructed from the original bundles."
    />
  );
}

export const settingsSections: SettingsSectionDefinition[] = [
  {
    id: "general-settings",
    title: "General",
    description: "General settings.",
    Component: GeneralSection,
  },
  {
    id: "account",
    title: "Account",
    description: "Account settings.",
    Component: AccountSection,
  },
  {
    id: "appearance",
    title: "Appearance",
    description: "Appearance settings.",
    Component: AppearanceSection,
  },
  {
    id: "agent",
    title: "Configuration",
    description: "Configuration settings.",
    Component: ConfigurationSection,
  },
  {
    id: "personalization",
    title: "Personalization",
    description: "Personalization settings.",
    Component: PersonalizationSection,
  },
  {
    id: "keyboard-shortcuts",
    title: "Keyboard shortcuts",
    description: "Keyboard shortcuts settings.",
    Component: KeyboardShortcutsSection,
  },
  {
    id: "mcp-settings",
    title: "MCP servers",
    description: "MCP settings.",
    Component: McpServersSection,
  },
  {
    id: "hooks-settings",
    title: "Hooks",
    description: "Hooks settings.",
    Component: HooksSection,
  },
  {
    id: "git-settings",
    title: "Git",
    description: "Git settings.",
    Component: GitSection,
  },
  {
    id: "connections",
    title: "Connections",
    description: "Connection settings.",
    Component: ConnectionsSection,
  },
  {
    id: "local-environments",
    title: "Environments",
    description: "Environment settings.",
    Component: EnvironmentsSection,
  },
  {
    id: "worktrees",
    title: "Worktrees",
    description: "Worktree settings.",
    Component: WorktreesSection,
  },
  {
    id: "browser-use",
    title: "Browser",
    description: "Browser settings.",
    Component: BrowserSection,
  },
  {
    id: "computer-use",
    title: "Computer use",
    description: "Computer use settings.",
    Component: ComputerUseSection,
  },
  {
    id: "usage",
    title: "Usage",
    description: "Usage settings.",
    Component: UsageSection,
  },
  {
    id: "data-controls",
    title: "Archived chats",
    description: "Archived chats settings.",
    Component: ArchivedChatsSection,
  },
];
