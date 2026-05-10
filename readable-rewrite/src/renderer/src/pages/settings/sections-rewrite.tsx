import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckIcon, ChevronDownIcon } from "@/components/AppIcons";
import { useAppStore } from "@/app/store";
import type {
  AgentEnvironment,
  AgentReasoningSpeed,
  GeneralSettingsModel,
} from "@shared/app-model";

export type SettingsSectionDefinition = {
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

const notificationTurnModeOptions: Array<{
  value: GeneralSettingsModel["notificationsTurnMode"];
  label: string;
}> = [
  { value: "off", label: "Never" },
  { value: "unfocused", label: "Only when unfocused" },
  { value: "always", label: "Always" },
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
        "flex min-h-10 items-center justify-between gap-3 px-4 py-1 max-sm:min-h-0 max-sm:flex-col max-sm:items-stretch",
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

function SettingsActionButton({
  children,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "inline-flex h-8 items-center justify-center rounded-lg border border-token-border bg-token-bg-primary px-3 text-sm text-token-text-primary shadow-sm",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-interaction hover:bg-token-list-hover-background",
      )}
      onClick={onClick}
    >
      {children}
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
        "inline-flex h-8 w-[240px] items-center justify-between gap-0.5 rounded-lg border border-token-border bg-token-bg-primary px-2.5 py-0 text-sm text-token-text-primary shadow-sm max-sm:w-full",
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

function isMacPlatform(platform: string) {
  return platform === "darwin" || platform === "macOS";
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
        <MenuTrigger onClick={() => setOpen((current) => !current)}>
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
  const selected =
    agentEnvironmentOptions.find((option) => option.value === value) ??
    agentEnvironmentOptions[0];
  const initial =
    agentEnvironmentOptions.find((option) => option.value === initialValue) ?? selected;

  return (
    <div className="flex w-[320px] max-w-full flex-col items-end gap-2 max-sm:w-full max-sm:items-stretch">
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
          <MenuTrigger onClick={() => setOpen((current) => !current)}>
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
        <MenuTrigger onClick={() => setOpen((current) => !current)}>
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
          onChange={setQuery}
          placeholder="Search languages"
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
      contentClassName="w-[320px] max-w-xs"
      trigger={
        <MenuTrigger onClick={() => setOpen((current) => !current)}>
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

function WindowHotkeyControl({
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
  const captureInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (capturing) {
      captureInputRef.current?.focus();
      captureInputRef.current?.select();
    }
  }, [capturing]);

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

  return (
    <div className="flex w-[320px] max-w-full flex-col items-end gap-2 max-sm:w-full max-sm:items-stretch">
      <div className="flex items-center justify-end gap-2 max-sm:flex-wrap max-sm:justify-stretch">
        {capturing ? (
          <input
            ref={captureInputRef}
            readOnly
            value="Press shortcut"
            className="h-8 w-[148px] rounded-lg border border-token-border bg-token-input-background px-2.5 text-sm text-token-text-primary shadow-sm outline-none"
            onKeyDown={handleCaptureKeyDown}
          />
        ) : (
          <div className="min-w-[96px] text-right text-sm text-token-text-secondary max-sm:min-w-0 max-sm:flex-1 max-sm:text-left">
            {supported ? formatHotkeyLabel(hotkey) : "Unavailable"}
          </div>
        )}
        {capturing ? (
          <SettingsActionButton disabled={busy} onClick={() => setCapturing(false)}>
            Cancel
          </SettingsActionButton>
        ) : (
          <>
            <SettingsActionButton
              disabled={!supported || busy}
              onClick={() => {
                setCapturing(true);
                setErrorText(null);
              }}
            >
              {hotkey ? "Change" : "Set"}
            </SettingsActionButton>
            {hotkey ? (
              <SettingsActionButton
                disabled={!supported || busy}
                onClick={() => {
                  void syncHotkey(null);
                }}
              >
                Clear
              </SettingsActionButton>
            ) : null}
          </>
        )}
      </div>
      {errorText ? (
        <div className="text-right text-xs text-token-error-foreground max-sm:text-left">
          {errorText}
        </div>
      ) : null}
    </div>
  );
}

function GeneralSection() {
  const general = useAppStore((state) => state.settings.general);
  const agent = useAppStore((state) => state.settings.agent);
  const platform = useAppStore((state) => state.bootstrap.platform);
  const updateSettings = useAppStore((state) => state.updateSettings);
  const isWindows = platform === "win32" || platform === "windows";
  const modifierLabel = getModifierLabel(platform);
  const invertFollowUpShortcutLabel = getInvertFollowUpShortcutLabel(
    platform,
    general.composerEnterBehavior,
  );
  const initialAgentEnvironmentRef = useRef(agent.agentEnvironment);

  return (
    <SettingsContentLayout title="General">
      <SettingsGroup className="gap-2">
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
            <SettingsRow
              label="Popout Window hotkey"
              description="Set a global shortcut for Popout Window. Leave unset to keep it off."
              control={
                <WindowHotkeyControl
                  value={general.popoutWindowHotkey}
                  onChange={(nextHotkey) =>
                    updateSettings("general", { popoutWindowHotkey: nextHotkey })
                  }
                />
              }
            />
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
              label="Suggested prompts"
              description="Suggest what to do next by searching project files and connected apps"
              control={
                <SettingsToggle
                  checked={general.suggestedPromptsEnabled}
                  ariaLabel="Enable ambient suggestions"
                  onChange={(checked) => {
                    void updateSettings("general", {
                      suggestedPromptsEnabled: checked,
                    });
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

function NotYetSection({ title }: { title: string }) {
  return (
    <SettingsContentLayout title={title}>
      <div className="rounded-xl border border-token-border bg-token-input-background px-4 py-4 text-sm text-token-text-secondary shadow-sm">
        This page is still being reconstructed from the original desktop bundles.
      </div>
    </SettingsContentLayout>
  );
}

function AccountSection() {
  return <NotYetSection title="Account" />;
}

function AppearanceSection() {
  return <NotYetSection title="Appearance" />;
}

function ConfigurationSection() {
  return <NotYetSection title="Configuration" />;
}

function PersonalizationSection() {
  return <NotYetSection title="Personalization" />;
}

function KeyboardShortcutsSection() {
  return <NotYetSection title="Keyboard shortcuts" />;
}

function McpServersSection() {
  return <NotYetSection title="MCP servers" />;
}

function HooksSection() {
  return <NotYetSection title="Hooks" />;
}

function GitSection() {
  return <NotYetSection title="Git" />;
}

function ConnectionsSection() {
  return <NotYetSection title="Connections" />;
}

function EnvironmentsSection() {
  return <NotYetSection title="Environments" />;
}

function WorktreesSection() {
  return <NotYetSection title="Worktrees" />;
}

function BrowserSection() {
  return <NotYetSection title="Browser" />;
}

function ComputerUseSection() {
  return <NotYetSection title="Computer use" />;
}

function UsageSection() {
  return <NotYetSection title="Usage" />;
}

function ArchivedChatsSection() {
  return <NotYetSection title="Archived chats" />;
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
