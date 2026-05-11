import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  EverydayChatIcon,
  ExternalArrowIcon,
  SearchIcon,
  TerminalIcon,
} from "@/components/AppIcons";
import { useAppStore } from "@/app/store";
import type {
  AgentApprovalPolicy,
  AgentEnvironment,
  AgentReasoningSpeed,
  AgentSandboxMode,
  AppearanceSettingsModel,
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

type HotkeyEventLike = {
  altKey: boolean;
  code: string;
  ctrlKey: boolean;
  key: string;
  metaKey: boolean;
  shiftKey: boolean;
};

const vscodeIconUrl = "/apps/vscode.png";

const integratedTerminalShellOptions: Option<
  GeneralSettingsModel["integratedTerminalShell"]
>[] = [
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

const notificationTurnModeOptions: Array<{
  value: GeneralSettingsModel["notificationsTurnMode"];
  label: string;
}> = [
  { value: "off", label: "Never" },
  { value: "unfocused", label: "Only when unfocused" },
  { value: "always", label: "Always" },
];

const themeModeOptions: Array<{
  value: AppearanceSettingsModel["themeMode"];
  label: string;
}> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

const approvalPolicyOptions: Option<AgentApprovalPolicy>[] = [
  {
    value: "untrusted",
    label: "Untrusted",
    description: "Always ask before taking action",
  },
  {
    value: "on-failure",
    label: "On failure",
    description: "Ask only when a command fails",
  },
  {
    value: "on-request",
    label: "On request",
    description: "Ask when escalation is requested",
  },
  {
    value: "never",
    label: "Never",
    description: "Run without asking for approval",
  },
];

const sandboxModeOptions: Option<AgentSandboxMode>[] = [
  {
    value: "read-only",
    label: "Read only",
    description: "Can read files, but cannot edit them",
  },
  {
    value: "workspace-write",
    label: "Workspace write",
    description: "Can edit files, but only in this workspace",
  },
  {
    value: "danger-full-access",
    label: "Full access",
    description: "Can edit files outside this workspace",
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

const hotkeyCodeMap: Record<string, string> = {
  Backquote: "Backquote",
  Backslash: "Backslash",
  BracketLeft: "LeftBracket",
  BracketRight: "RightBracket",
  Comma: "Comma",
  Equal: "Plus",
  Minus: "Minus",
  Period: "Period",
  Quote: "Quote",
  Semicolon: "Semicolon",
  Slash: "Slash",
};

const hotkeyDisplayMap: Record<string, string> = {
  Backquote: "`",
  Backslash: "\\",
  Command: "Cmd",
  Comma: ",",
  Control: "Ctrl",
  Esc: "Esc",
  LeftBracket: "[",
  Period: ".",
  Plus: "+",
  Quote: "'",
  RightBracket: "]",
  Semicolon: ";",
  Slash: "/",
};

function clsx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function formatRelativeImportTime(value: string) {
  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return "recently";
  }

  const diffMs = Date.now() - timestamp;
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < hourMs) {
    const minutes = Math.max(1, Math.floor(diffMs / minuteMs));
    return `${minutes} min`;
  }

  if (diffMs < dayMs) {
    const hours = Math.max(1, Math.floor(diffMs / hourMs));
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  const days = Math.max(1, Math.floor(diffMs / dayMs));
  return `${days} day${days === 1 ? "" : "s"}`;
}

type SettingsButtonColor = "ghost" | "primary" | "secondary";
type SettingsButtonSize = "default" | "toolbar";
type SettingsRowVariant = "default" | "nested";

function getSettingsButtonClass({
  className,
  color = "secondary",
  size = "toolbar",
}: {
  className?: string;
  color?: SettingsButtonColor;
  size?: SettingsButtonSize;
}) {
  const colorClass =
    color === "ghost"
      ? "text-token-text-tertiary enabled:hover:bg-token-list-hover-background data-[state=open]:bg-token-list-hover-background border-transparent"
      : color === "primary"
        ? "bg-token-foreground enabled:hover:bg-token-foreground/80 data-[state=open]:bg-token-foreground/80 text-token-dropdown-background border-transparent"
        : "text-token-foreground bg-token-foreground/5 enabled:hover:bg-token-foreground/10 data-[state=open]:bg-token-foreground/10 border-transparent";
  const sizeClass =
    size === "default"
      ? "rounded-full px-2 py-0.5 text-sm leading-[18px]"
      : "h-token-button-composer rounded-lg px-2 py-0 text-base leading-[18px]";

  return clsx(
    "border-token-border user-select-none no-drag cursor-interaction flex items-center gap-1 border whitespace-nowrap focus:outline-none disabled:cursor-not-allowed disabled:opacity-40",
    colorClass,
    sizeClass,
    className,
  );
}

function SettingsContentLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="main-surface flex h-full min-h-0 flex-col">
      <div className="draggable flex items-center px-panel electron:h-toolbar extension:h-toolbar-sm" />
      <div className="scrollbar-stable flex-1 overflow-y-auto p-panel">
        <div className="mx-auto flex w-full max-w-2xl flex-col electron:min-w-[calc(320px*var(--codex-window-zoom))]">
          <div className="flex items-center justify-between gap-3 pb-panel">
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 pb-panel">
              <div className="electron:heading-lg heading-base truncate">{title}</div>
              {subtitle ? (
                <div className="text-base text-token-text-secondary">{subtitle}</div>
              ) : null}
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
  actions,
  className,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  if (!title && !subtitle && !actions) {
    return null;
  }

  return (
    <div
      className={clsx(
        subtitle
          ? "flex items-start justify-between gap-2 px-0 pt-[calc((var(--height-toolbar)-1.5rem)/2)]"
          : "flex h-toolbar items-center justify-between gap-2 px-0 py-0",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {title ? (
          <div className="text-base font-medium text-token-text-primary">{title}</div>
        ) : null}
        {subtitle ? (
          <div className="text-base font-normal text-token-text-tertiary">{subtitle}</div>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
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
  icon,
  id,
  variant = "default",
  className,
}: {
  label: ReactNode;
  description?: ReactNode;
  control: ReactNode;
  icon?: ReactNode;
  id?: string;
  variant?: SettingsRowVariant;
  className?: string;
}) {
  const rowClass =
    variant === "nested"
      ? "flex min-h-10 items-center justify-between gap-3 px-4 py-0.5 max-sm:min-h-0 max-sm:flex-col max-sm:items-stretch"
      : "flex items-center justify-between gap-4 p-3";
  const descriptionClass =
    variant === "nested"
      ? "min-w-0 text-xs text-token-text-secondary"
      : "min-w-0 text-sm text-token-text-secondary";
  const controlClass =
    variant === "nested"
      ? "flex min-w-0 flex-1 items-center justify-end max-sm:justify-stretch"
      : "flex shrink-0 items-center gap-2";

  return (
    <div
      id={id}
      className={clsx(rowClass, className)}
    >
      <div className="flex min-w-0 items-center gap-3">
        {icon ? <span className="shrink-0">{icon}</span> : null}
        <div className="flex min-w-0 flex-col gap-1">
          <div className="min-w-0 text-sm text-token-text-primary">{label}</div>
          {description ? <div className={descriptionClass}>{description}</div> : null}
        </div>
      </div>
      <div className={controlClass}>{control}</div>
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
            "h-4 w-4 rounded-full border border-[color:var(--gray-0)] bg-[color:var(--gray-0)] shadow-sm transition-transform duration-200 ease-out data-[state=unchecked]:translate-x-[2px] data-[state=checked]:translate-x-[14px]",
          )}
          data-state={state}
        />
      </span>
    </button>
  );
}

function SettingsActionButton({
  children,
  disabled = false,
  color = "secondary",
  className,
  loading = false,
  onMouseDown,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  color?: SettingsButtonColor;
  className?: string;
  loading?: boolean;
  onMouseDown?: (event: ReactMouseEvent<HTMLButtonElement>) => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={getSettingsButtonClass({ className, color, size: "toolbar" })}
      onMouseDown={onMouseDown}
      onClick={onClick}
    >
      {loading ? "Loading" : children}
    </button>
  );
}

function MenuTrigger({
  children,
  disabled = false,
  open = false,
  className,
  contentClassName,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  open?: boolean;
  className?: string;
  contentClassName?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      data-state={open ? "open" : "closed"}
      className={getSettingsButtonClass({
        className: clsx(
          "w-[240px] justify-between",
          className,
        ),
        color: "secondary",
        size: "toolbar",
      })}
      onClick={onClick}
    >
      <span className={clsx("flex min-w-0 flex-1 items-center gap-1.5", contentClassName)}>
        {children}
      </span>
      <ChevronDownIcon className="icon-2xs shrink-0 text-token-input-placeholder-foreground" />
    </button>
  );
}

function DropdownMenu({
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
    <div className="relative" ref={rootRef}>
      {trigger}
      {open && !disabled ? (
        <div
          role="menu"
          className={clsx(
            "no-drag bg-token-dropdown-background/90 text-token-foreground ring-token-border absolute top-[calc(100%+1px)] z-50 m-px flex max-h-[calc(100vh-16px)] min-w-[220px] select-none flex-col overflow-y-auto rounded-xl px-1 py-1 shadow-xl-spread ring-[0.5px] backdrop-blur-sm",
            align === "end" ? "right-0" : "left-0",
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
        "no-drag text-token-foreground outline-hidden rounded-lg px-[var(--padding-row-x)] py-[var(--padding-row-y)] text-sm",
        disabled
          ? "cursor-default opacity-50"
          : "group cursor-interaction hover:bg-token-list-hover-background focus:bg-token-list-hover-background",
      )}
      onClick={onSelect}
    >
      <div className="flex w-full items-center gap-1.5">
        <span className="min-w-0 flex-1">{children}</span>
        {selected ? (
          <CheckIcon className="icon-xs shrink-0 opacity-75 group-hover:opacity-100 group-focus:opacity-100" />
        ) : null}
      </div>
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
    <div className="flex w-full items-center gap-1.5 px-[var(--padding-row-x)] py-[var(--padding-row-y)]">
      <SearchIcon className="icon-2xs shrink-0 text-token-text-tertiary" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        spellCheck={false}
        className="!w-auto flex-1 appearance-none !rounded-none !border-none bg-transparent !px-0 !py-0 text-sm text-token-foreground outline-none placeholder:text-token-input-placeholder-foreground"
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
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
    <div className="inline-flex items-center gap-0.5" role="group">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <SettingsActionButton
            key={option.value}
            aria-pressed={isSelected}
            color={isSelected ? "secondary" : "ghost"}
            className={getSettingsButtonClass({
              color: isSelected ? "secondary" : "ghost",
              size: "default",
            })}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </SettingsActionButton>
        );
      })}
    </div>
  );
}

function SettingsNumberInput({
  ariaLabel,
  value,
  min,
  max,
  onChange,
}: {
  ariaLabel: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const commit = (raw: string) => {
    const parsed = Number.parseFloat(raw);
    if (Number.isNaN(parsed)) {
      return;
    }

    const clamped = Math.min(max, Math.max(min, parsed));
    onChange(clamped);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        key={`${ariaLabel}:${value}`}
        type="number"
        min={min}
        max={max}
        step={1}
        defaultValue={value}
        aria-label={ariaLabel}
        className="focus-visible:ring-token-focus h-token-button-composer w-16 rounded-lg border border-token-border bg-token-input-background px-2 py-0 text-right text-sm text-token-text-primary shadow-sm outline-none focus-visible:ring-2"
        onBlur={(event) => {
          commit(event.currentTarget.value);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(event.currentTarget.value);
          }
        }}
      />
      <span className="text-sm text-token-text-secondary">px</span>
    </div>
  );
}

function StatusText({ children }: { children: ReactNode }) {
  return <span className="text-sm text-token-text-secondary">{children}</span>;
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

function isWindowsPlatform(platform: string) {
  return platform === "win32" || platform === "windows";
}

function getModifierLabel(platform: string) {
  return isMacPlatform(platform) ? "Cmd" : "Ctrl";
}

function getShortcutLabel(platform: string, shortcut: "send" | "invert-follow-up") {
  if (isMacPlatform(platform)) {
    return shortcut === "send" ? "Cmd+Enter" : "Cmd+Shift+Enter";
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

function normalizeHotkeyKey(event: HotkeyEventLike) {
  if (/^Key[A-Z]$/.test(event.code)) {
    return event.code.slice(3);
  }

  if (/^Digit[0-9]$/.test(event.code)) {
    return event.code.slice(5);
  }

  if (/^Numpad[0-9]$/.test(event.code)) {
    return event.code.slice(6);
  }

  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(event.key)) {
    return event.key.toUpperCase();
  }

  if (event.code in hotkeyCodeMap) {
    return hotkeyCodeMap[event.code];
  }

  switch (event.key) {
    case " ":
      return "Space";
    case "ArrowDown":
      return "Down";
    case "ArrowLeft":
      return "Left";
    case "ArrowRight":
      return "Right";
    case "ArrowUp":
      return "Up";
    case "Backspace":
      return "Backspace";
    case "Delete":
      return "Delete";
    case "End":
      return "End";
    case "Enter":
      return "Enter";
    case "Home":
      return "Home";
    case "Insert":
      return "Insert";
    case "PageDown":
      return "PageDown";
    case "PageUp":
      return "PageUp";
    case "Tab":
      return "Tab";
    default:
      return null;
  }
}

function formatHotkeyLabel(hotkey: string | null) {
  if (!hotkey) {
    return "Off";
  }

  return hotkey
    .split("+")
    .map((part) => hotkeyDisplayMap[part] ?? part)
    .join("+");
}

function acceleratorFromKeyboardEvent(event: HotkeyEventLike) {
  const key = normalizeHotkeyKey(event);
  if (!key) {
    return null;
  }

  const modifiers: string[] = [];

  if (event.metaKey) {
    modifiers.push("Command");
  }
  if (event.ctrlKey) {
    modifiers.push("Control");
  }
  if (event.altKey) {
    modifiers.push("Alt");
  }
  if (event.shiftKey) {
    modifiers.push("Shift");
  }

  if (modifiers.length === 0 && !/^F([1-9]|1[0-9]|2[0-4])$/.test(key)) {
    return null;
  }

  return [...modifiers, key].join("+");
}

function openExternalIfAvailable(url: string) {
  void window.desktopApi?.openExternal(url);
}

function pathToFileUrl(path: string) {
  const normalized = path.replace(/\\/g, "/");
  const href = normalized.startsWith("/") ? `file://${normalized}` : `file:///${normalized}`;
  return encodeURI(href);
}

function openLocalPathIfAvailable(path: string) {
  if (!path) {
    return;
  }

  openExternalIfAvailable(pathToFileUrl(path));
}

function preventMouseDownFocusLoss(event: ReactMouseEvent<HTMLElement>) {
  event.preventDefault();
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

function ExternalAgentImportRow() {
  const general = useAppStore((state) => state.settings.general);
  const hasImportedAtLeastOnce = general.externalAgentImportLastImportedAt != null;
  const hasAvailableImport =
    general.externalAgentImportState === "ready" ||
    general.externalAgentImportState === "remaining" ||
    general.externalAgentImportState === "imported";
  const isChecking = general.externalAgentImportState === "checking";
  const isRemainingOnly = general.externalAgentImportState === "remaining";

  if (!isChecking && !hasAvailableImport && !hasImportedAtLeastOnce) {
    return null;
  }

  const label = hasImportedAtLeastOnce
    ? "Imported agent setup"
    : "Import work from other AI apps";
  const description = general.externalAgentImportLastImportedAt
    ? `Last imported ${formatRelativeImportTime(general.externalAgentImportLastImportedAt)} ago`
    : "Bring over your setup, projects, and recent chats";

  let actionLabel = "Import";
  if (isChecking) {
    actionLabel = "Checking";
  } else if (hasAvailableImport) {
    if (isRemainingOnly) {
      actionLabel = "Continue with Codex";
    } else if (hasImportedAtLeastOnce) {
      actionLabel = "Import again";
    }
  } else if (hasImportedAtLeastOnce) {
    actionLabel = "View imported files";
  }

  return (
    <SettingsRow
      id="external-agent-config-import-settings"
      label={label}
      description={description}
      control={
        <SettingsActionButton
          color="secondary"
          disabled
          onClick={() => undefined}
        >
          {actionLabel}
        </SettingsActionButton>
      }
    />
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
    icon: value === "vscode" ? vscodeIconUrl : null,
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
      align="end"
      contentClassName="w-[220px]"
      trigger={
        <MenuTrigger
          open={open}
          className="px-2.5"
          contentClassName="gap-1.5"
          onClick={() => setOpen((current) => !current)}
        >
          <LabeledOption
            icon={option.icon ? <img alt="" src={option.icon} className="icon-sm" /> : undefined}
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
          icon={option.icon ? <img alt="" src={option.icon} className="icon-sm" /> : undefined}
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
  const selected =
    agentEnvironmentOptions.find((option) => option.value === value) ??
    agentEnvironmentOptions[0];
  const initial =
    agentEnvironmentOptions.find((option) => option.value === initialValue) ?? selected;

  return (
    <div className="flex w-auto max-w-full flex-col items-end gap-2 max-sm:w-full max-sm:items-stretch">
      {initialValue !== value ? (
        <div className="text-right text-xs text-token-error-foreground max-sm:text-left">
          Restart Codex to apply this change. The agent is still running in {initial.label}.
        </div>
      ) : null}
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="w-[320px] max-w-xs space-y-1"
        trigger={
          <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
            <LabeledOption label={selected.label} />
          </MenuTrigger>
        }
      >
        {agentEnvironmentOptions.map((option) => (
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
    </div>
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
  const selected =
    integratedTerminalShellOptions.find((option) => option.value === value) ??
    integratedTerminalShellOptions[0];

  return (
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="w-[220px] max-w-xs"
        trigger={
          <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
            <LabeledOption label={selected.label} />
          </MenuTrigger>
        }
      >
      {integratedTerminalShellOptions.map((option) => (
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
      contentClassName="w-[240px]"
      trigger={
        <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
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
        contentClassName="w-[240px]"
        trigger={
          <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
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

function NotificationTurnModeSelect({
  value,
  onChange,
}: {
  value: GeneralSettingsModel["notificationsTurnMode"];
  onChange: (value: GeneralSettingsModel["notificationsTurnMode"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected =
    notificationTurnModeOptions.find((option) => option.value === value) ??
    notificationTurnModeOptions[1];

  return (
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="w-[240px]"
        trigger={
          <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
            <LabeledOption label={selected.label} />
          </MenuTrigger>
        }
      >
      <div className="max-h-80 overflow-y-auto">
        {notificationTurnModeOptions.map((option) => (
          <DropdownItem
            key={option.value}
            selected={option.value === value}
            onSelect={() => {
              setOpen(false);
              onChange(option.value);
            }}
          >
            <span className="truncate text-sm">{option.label}</span>
          </DropdownItem>
        ))}
      </div>
    </DropdownMenu>
  );
}

function ApprovalPolicySelect({
  value,
  onChange,
}: {
  value: AgentApprovalPolicy;
  onChange: (value: AgentApprovalPolicy) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected =
    approvalPolicyOptions.find((option) => option.value === value) ?? approvalPolicyOptions[2];

  return (
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="w-[320px] max-w-xs"
        trigger={
          <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
            <LabeledOption label={selected.label} />
          </MenuTrigger>
        }
      >
      {approvalPolicyOptions.map((option) => (
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

function SandboxModeSelect({
  value,
  onChange,
}: {
  value: AgentSandboxMode;
  onChange: (value: AgentSandboxMode) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected =
    sandboxModeOptions.find((option) => option.value === value) ?? sandboxModeOptions[0];

  return (
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="w-[320px] max-w-xs"
        trigger={
          <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
            <LabeledOption label={selected.label} />
          </MenuTrigger>
        }
      >
      {sandboxModeOptions.map((option) => (
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

function PetSelect({
  value,
}: {
  value: string;
}) {
  const [open, setOpen] = useState(false);

  return (
      <DropdownMenu
        open={open}
        onOpenChange={setOpen}
        align="end"
        contentClassName="w-[220px] max-w-xs"
        trigger={
          <MenuTrigger open={open} onClick={() => setOpen((current) => !current)}>
            <LabeledOption label={value} />
          </MenuTrigger>
        }
      >
      <DropdownItem
        selected
        onSelect={() => {
          setOpen(false);
        }}
      >
        <span className="text-sm">{value}</span>
      </DropdownItem>
    </DropdownMenu>
  );
}

function PopoutWindowHotkeyRow({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string | null) => Promise<void>;
}) {
  const [supported, setSupported] = useState(true);
  const [hotkey, setHotkey] = useState<string | null>(value);
  const [capturing, setCapturing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    setHotkey(value);
  }, [value]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const nextState = await window.desktopApi?.getWindowHotkeyState();
        if (!nextState || cancelled) {
          return;
        }

        setSupported(nextState.supported);
        setHotkey(nextState.hotkey);
      } catch {
        if (!cancelled) {
          setSupported(false);
        }
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const syncHotkey = async (nextHotkey: string | null) => {
    setErrorText(null);
    setBusy(true);

    try {
      const state = nextHotkey
        ? await window.desktopApi?.setWindowHotkey(nextHotkey)
        : await window.desktopApi?.clearWindowHotkey();

      const resolvedHotkey = state?.hotkey ?? null;
      setSupported(state?.supported ?? true);
      setHotkey(resolvedHotkey);
      await onChange(resolvedHotkey);
      setCapturing(false);
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : "Unable to set shortcut");
    } finally {
      setBusy(false);
    }
  };

  const handleCaptureKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.repeat) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.key === "Escape") {
      setCapturing(false);
      setErrorText(null);
      return;
    }

    const accelerator = acceleratorFromKeyboardEvent(event);
    if (!accelerator) {
      return;
    }

    void syncHotkey(accelerator);
  };

  if (!supported) {
    return null;
  }

  return (
    <SettingsRow
      label="Popout Window hotkey"
      description={
        <div className="flex flex-col gap-1">
          <span>Set a global shortcut for Popout Window. Leave unset to keep it off.</span>
          {errorText ? <span className="text-token-error-foreground">{errorText}</span> : null}
        </div>
      }
      control={
        capturing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              readOnly
              value="Press shortcut"
              aria-label="Popout Window hotkey capture"
              className="h-9 w-36 rounded-md border border-token-input-border bg-token-input-background px-2 text-sm text-token-input-foreground transition-colors outline-none focus:border-token-focus-border"
              onBlur={() => {
                setCapturing(false);
              }}
              onKeyDown={handleCaptureKeyDown}
            />
            <SettingsActionButton
              color="ghost"
              disabled={busy}
              onMouseDown={preventMouseDownFocusLoss}
              onClick={() => {
                setCapturing(false);
              }}
            >
              Cancel
            </SettingsActionButton>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="min-w-20 text-right text-sm text-token-text-secondary">
              {formatHotkeyLabel(hotkey)}
            </span>
            <SettingsActionButton
              color="secondary"
              disabled={busy}
              onClick={() => {
                setErrorText(null);
                setCapturing(true);
              }}
            >
              {hotkey ? "Change" : "Set"}
            </SettingsActionButton>
            {hotkey ? (
              <SettingsActionButton
                color="ghost"
                disabled={busy}
                onClick={() => {
                  void syncHotkey(null);
                }}
              >
                Clear
              </SettingsActionButton>
            ) : null}
          </div>
        )
      }
    />
  );
}

function GeneralSection() {
  const general = useAppStore((state) => state.settings.general);
  const agent = useAppStore((state) => state.settings.agent);
  const platform = useAppStore((state) => state.bootstrap.platform);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const isWindows = isWindowsPlatform(platform);
  const modifierLabel = getModifierLabel(platform);
  const invertFollowUpShortcutLabel = getInvertFollowUpShortcutLabel(
    platform,
    general.composerEnterBehavior,
  );
  const initialAgentEnvironmentRef = useRef(agent.agentEnvironment);
  const showGuardianOption = true;

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
                  ariaLabel="Default permissions"
                  onChange={() => undefined}
                />
              }
            />
            {showGuardianOption ? (
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
                    ariaLabel="Auto-review"
                    onChange={(checked) => {
                      void updateSettings("agent", {
                        showAutoReviewPermissions: checked,
                      });
                    }}
                  />
                }
              />
            ) : null}
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
                  ariaLabel="Full access"
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
            {isWindows ? (
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
            {isWindows ? (
              <SettingsRow
                label="Integrated terminal shell"
                description="Choose which shell opens in the integrated terminal."
                control={
                  <IntegratedTerminalShellSelect
                    value={general.integratedTerminalShell}
                    onChange={(value) => {
                      void updateSettings("general", { integratedTerminalShell: value });
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
            <PopoutWindowHotkeyRow
              value={general.popoutWindowHotkey}
              onChange={(nextHotkey) =>
                updateSettings("general", { popoutWindowHotkey: nextHotkey })
              }
            />
            {!isWindows ? (
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
            <SettingsRow
              label={`Require ${modifierLabel} + enter to send long prompts`}
              description={`When enabled, multiline prompts require ${modifierLabel} + enter to send.`}
              control={
                <SettingsToggle
                  checked={general.composerEnterBehavior === "cmdIfMultiline"}
                  ariaLabel={`Require ${modifierLabel} + enter to send long prompts`}
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
            <SettingsRow
              label="Suggested prompts"
              description="Suggest what to do next by searching project files and connected apps"
              control={
                <SettingsToggle
                  checked={general.suggestedPromptsEnabled}
                  ariaLabel="Suggested prompts"
                  onChange={(checked) => {
                    void updateSettings("general", {
                      suggestedPromptsEnabled: checked,
                    });
                  }}
                />
              }
            />
            <ExternalAgentImportRow />
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupHeader title="Notifications" />
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Turn completion notifications"
              description="Set when Codex alerts you that it's finished"
              control={
                <NotificationTurnModeSelect
                  value={general.notificationsTurnMode}
                  onChange={(value) => {
                    void updateSettings("general", { notificationsTurnMode: value });
                  }}
                />
              }
            />
            <SettingsRow
              label="Enable permission notifications"
              description="Show alerts when notification permissions are required"
              control={
                <SettingsToggle
                  checked={general.notificationsPermissionsEnabled}
                  ariaLabel="Enable permission notifications"
                  onChange={(checked) => {
                    void updateSettings("general", {
                      notificationsPermissionsEnabled: checked,
                    });
                  }}
                />
              }
            />
            <SettingsRow
              label="Enable question notifications"
              description="Show alerts when input is needed to continue"
              control={
                <SettingsToggle
                  checked={general.notificationsQuestionsEnabled}
                  ariaLabel="Enable question notifications"
                  onChange={(checked) => {
                    void updateSettings("general", {
                      notificationsQuestionsEnabled: checked,
                    });
                  }}
                />
              }
            />
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>
    </SettingsContentLayout>
  );
}

function AppearanceSection() {
  const appearance = useAppStore((state) => state.settings.appearance);
  const platform = useAppStore((state) => state.bootstrap.platform);
  const updateSettings = useAppStore((state) => state.updateSettings);

  return (
    <SettingsContentLayout title="Appearance">
      <SettingsGroup className="gap-2">
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Theme"
              description="Use light, dark, or match your system"
              className="gap-6"
              control={
                <SegmentedToggle
                  value={appearance.themeMode}
                  options={themeModeOptions}
                  onChange={(value) => {
                    void updateSettings("appearance", { themeMode: value });
                  }}
                />
              }
            />
            <SettingsRow
              label="Use pointer cursors"
              description="Change the cursor to a pointer when hovering over interactive elements"
              control={
                <SettingsToggle
                  checked={appearance.usePointerCursors}
                  ariaLabel="Use pointer cursors"
                  onChange={(checked) => {
                    void updateSettings("appearance", { usePointerCursors: checked });
                  }}
                />
              }
            />
            <SettingsRow
              label="UI font size"
              description="Adjust the base size used for the Codex UI"
              control={
                <SettingsNumberInput
                  ariaLabel="UI font size"
                  value={appearance.uiFontSize}
                  min={11}
                  max={16}
                  onChange={(value) => {
                    void updateSettings("appearance", { uiFontSize: value });
                  }}
                />
              }
            />
            <SettingsRow
              label="Code font size"
              description="Adjust the base size used for code across chats and diffs"
              control={
                <SettingsNumberInput
                  ariaLabel="Code font size"
                  value={appearance.codeFontSize}
                  min={8}
                  max={24}
                  onChange={(value) => {
                    void updateSettings("appearance", { codeFontSize: value });
                  }}
                />
              }
            />
            {isMacPlatform(platform) ? (
              <SettingsRow
                label="Font Smoothing"
                description="Use native macOS font anti-aliasing"
                control={
                  <SettingsToggle
                    checked={appearance.fontSmoothing}
                    ariaLabel="Font Smoothing"
                    onChange={(checked) => {
                      void updateSettings("appearance", { fontSmoothing: checked });
                    }}
                  />
                }
              />
            ) : null}
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupHeader title="Pets" />
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Show pet"
              description="Show the floating Codex pet in the app window"
              control={
                <SettingsToggle
                  checked={appearance.petVisible}
                  ariaLabel="Show pet"
                  onChange={(checked) => {
                    void updateSettings("appearance", { petVisible: checked });
                  }}
                />
              }
            />
            <SettingsRow
              label="Selected pet"
              description="The currently selected Codex pet"
              control={<PetSelect value={appearance.selectedPet} />}
            />
            <SettingsRow
              label="Custom pets"
              description={<span className="font-mono text-xs">{appearance.customPetFolder}</span>}
              control={
                <SettingsActionButton
                  onClick={() => {
                    openLocalPathIfAvailable(appearance.customPetFolder);
                  }}
                >
                  Open folder
                  <ExternalArrowIcon className="icon-2xs" />
                </SettingsActionButton>
              }
            />
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>
    </SettingsContentLayout>
  );
}

function ConfigurationSection() {
  const agent = useAppStore((state) => state.settings.agent);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const configPathIsAbsolute = /^[A-Za-z]:\\/.test(agent.configPath) || agent.configPath.startsWith("/");

  return (
    <SettingsContentLayout
      title="Configuration"
      subtitle={
        <>
          Configure approval policy and sandbox settings.{" "}
          <ElevatedRiskLink>Learn more</ElevatedRiskLink>
        </>
      }
    >
      <SettingsGroup className="gap-2">
        <SettingsGroupHeader title="Custom config.toml settings" />
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="config.toml"
              description={
                <>
                  Edit your config to customize agent behavior. Restart Codex after editing to apply changes.
                  {agent.configPath ? (
                    <>
                      {" "}
                      <span className="font-mono text-xs">{agent.configPath}</span>
                    </>
                  ) : null}
                </>
              }
              control={
                <SettingsActionButton
                  disabled={!configPathIsAbsolute}
                  onClick={() => {
                    if (configPathIsAbsolute) {
                      openLocalPathIfAvailable(agent.configPath);
                    }
                  }}
                >
                  Open
                </SettingsActionButton>
              }
            />
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Approval policy"
              description="Choose when Codex asks for approval"
              control={
                <ApprovalPolicySelect
                  value={agent.approvalPolicy}
                  onChange={(value) => {
                    void updateSettings("agent", { approvalPolicy: value });
                  }}
                />
              }
            />
            <SettingsRow
              label="Sandbox settings"
              description="Choose how much Codex can do when running commands"
              control={
                <SandboxModeSelect
                  value={agent.sandboxMode}
                  onChange={(value) => {
                    void updateSettings("agent", { sandboxMode: value });
                  }}
                />
              }
            />
            {agent.sandboxMode === "workspace-write" ? (
              <SettingsRow
                label="Allow network access"
                description="Allow network access when the sandbox is set to workspace write"
                control={
                  <SettingsToggle
                    checked={agent.networkAccess}
                    ariaLabel="Allow network access"
                    onChange={(checked) => {
                      void updateSettings("agent", { networkAccess: checked });
                    }}
                  />
                }
              />
            ) : null}
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupHeader title="Workspace Dependencies" />
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Current version"
              description={
                agent.dependencyHealth === "healthy"
                  ? undefined
                  : "Run diagnostics or reinstall if tool calls fail"
              }
              control={
                <StatusText>
                  {agent.dependencyBundleVersion || "Not installed"}
                </StatusText>
              }
            />
            <SettingsRow
              label="Codex dependencies"
              description="Allow Codex to install and expose bundled Node.js and Python tools"
              control={
                <SettingsToggle
                  checked={agent.dependenciesEnabled}
                  ariaLabel="Codex dependencies"
                  onChange={(checked) => {
                    void updateSettings("agent", { dependenciesEnabled: checked });
                  }}
                />
              }
            />
            <SettingsRow
              label="Diagnose issues in Codex Workspace"
              description="Checks the current bundle and records diagnostic logs"
              control={
                <SettingsActionButton disabled onClick={() => undefined}>
                  Diagnose
                </SettingsActionButton>
              }
            />
            <SettingsRow
              label="Reset and install Workspace"
              description="Deletes the local bundle, downloads it again, and reloads tools"
              control={
                <SettingsActionButton disabled onClick={() => undefined}>
                  Reinstall
                </SettingsActionButton>
              }
            />
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupHeader title="Experimental features (Beta)" />
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="No beta experimental features available"
              control={<span className="h-5 w-8" />}
            />
          </SettingsSurface>
        </SettingsGroupContent>
      </SettingsGroup>

      <SettingsGroup className="gap-2">
        <SettingsGroupContent>
          <SettingsSurface>
            <SettingsRow
              label="Open source licenses"
              description="Third-party notices for bundled dependencies"
              control={
                <SettingsActionButton disabled onClick={() => undefined}>
                  View
                </SettingsActionButton>
              }
            />
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

function AccountSection() {
  return (
    <NotImplementedSection
      title="Account"
      description="Account settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function PersonalizationSection() {
  return (
    <NotImplementedSection
      title="Personalization"
      description="Personalization settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function McpServersSection() {
  return (
    <NotImplementedSection
      title="MCP servers"
      description="MCP settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function HooksSection() {
  return (
    <NotImplementedSection
      title="Hooks"
      description="Hooks settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function KeyboardShortcutsSection() {
  return (
    <NotImplementedSection
      title="Keyboard shortcuts"
      description="Keyboard shortcuts are still being reconstructed from the original desktop bundles."
    />
  );
}

function GitSection() {
  return (
    <NotImplementedSection
      title="Git"
      description="Git settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function ConnectionsSection() {
  return (
    <NotImplementedSection
      title="Connections"
      description="Connection settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function UsageSection() {
  return (
    <NotImplementedSection
      title="Usage"
      description="Usage settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function EnvironmentsSection() {
  return (
    <NotImplementedSection
      title="Environments"
      description="Environment settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function WorktreesSection() {
  return (
    <NotImplementedSection
      title="Worktrees"
      description="Worktree settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function BrowserSection() {
  return (
    <NotImplementedSection
      title="Browser"
      description="Browser settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function ComputerUseSection() {
  return (
    <NotImplementedSection
      title="Computer use"
      description="Computer use settings are still being reconstructed from the original desktop bundles."
    />
  );
}

function ArchivedChatsSection() {
  return (
    <NotImplementedSection
      title="Archived chats"
      description="Archived chats are still being reconstructed from the original desktop bundles."
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
