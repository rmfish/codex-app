export const APP_STATE_SCHEMA_VERSION = 1;

export type ThemeMode = "system" | "light" | "dark";
export type BrowserApprovalMode = "always-ask" | "always-allow";
export type AnnotationScreenshotMode = "necessary" | "always";
export type AgentApprovalPolicy =
  | "untrusted"
  | "on-failure"
  | "on-request"
  | "never";
export type AgentSandboxMode =
  | "read-only"
  | "workspace-write"
  | "danger-full-access";
export type AgentConfigScope = "project" | "user" | "managed";
export type AgentReasoningSpeed = "standard" | "fast";
export type AgentDependencyHealth =
  | "healthy"
  | "repair-needed"
  | "not-installed";
export type AgentEnvironment = "windows-native" | "wsl";
export type RemoteConnectionAvailability =
  | "online"
  | "busy"
  | "offline"
  | "update-required";
export type LocalEnvironmentPlatform = "windows" | "macos" | "linux";
export type LocalEnvironmentActionIcon = "run" | "test" | "debug" | "tool";

export type DesktopBootstrapState = {
  appName: string;
  appVersion: string;
  isPackaged: boolean;
  platform: NodeJS.Platform | string;
  systemTheme: "light" | "dark";
  dataFilePath: string;
};

export type ChatThread = {
  id: string;
  title: string;
  workspace: string;
  branch: string;
  status: "active" | "draft" | "remote";
  summary: string;
  updatedAt: string;
  tags: string[];
};

export type ConversationMessage = {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  meta?: string;
};

export type ActivityItem = {
  id: string;
  kind: "tool" | "file" | "system" | "security";
  title: string;
  detail: string;
  timestamp: string;
};

export type PluginDescriptor = {
  id: string;
  name: string;
  category: string;
  description: string;
  status: "connected" | "available" | "disabled";
  transport: "oauth" | "local" | "mcp";
  scopes: string[];
  riskNote: string;
};

export type ScheduleMode =
  | "daily"
  | "weekdays"
  | "weekly"
  | "hourly"
  | "interval"
  | "custom";

export type AutomationSchedule = {
  mode: ScheduleMode;
  time: string;
  days: string[];
  intervalHours: number;
  intervalMinutes: number;
  customRrule: string;
};

export type AutomationRecord = {
  id: string;
  name: string;
  workspace: string;
  status: "ACTIVE" | "PAUSED";
  prompt: string;
  notes: string;
  lastRun: string;
  nextRun: string;
  schedule: AutomationSchedule;
};

export type GeneralSettingsModel = {
  workMode: "coding" | "everyday";
  defaultOpenTarget: "vscode";
  integratedTerminalShell:
    | "powershell"
    | "commandPrompt"
    | "gitBash"
    | "wsl";
  localeOverride: string | null;
  composerEnterBehavior: "enter" | "cmdIfMultiline";
  followUpBehavior: "queue" | "steer";
  reviewDelivery: "inline" | "detached";
  preventSleepWhileRunning: boolean;
};

export type AppearanceSettingsModel = {
  themeMode: ThemeMode;
  density: "comfortable" | "compact";
  codeFontScale: "small" | "medium" | "large";
  petVisible: boolean;
  selectedPet: string;
  customPetFolder: string;
};

export type AgentSettingsModel = {
  approvalPolicy: AgentApprovalPolicy;
  sandboxMode: AgentSandboxMode;
  networkAccess: boolean;
  configScope: AgentConfigScope;
  configPath: string;
  speed: AgentReasoningSpeed;
  dependenciesEnabled: boolean;
  dependencyBundleVersion: string;
  dependencyHealth: AgentDependencyHealth;
  showAutoReviewPermissions: boolean;
  showFullAccessPermissions: boolean;
  agentEnvironment: AgentEnvironment;
};

export type AccountSettingsModel = {
  authMethod: string;
  email: string;
  accountId: string;
  userId: string;
  plan: string;
  browserToken: string;
};

export type BrowserUseSettingsModel = {
  enabled: boolean;
  websiteApproval: BrowserApprovalMode;
  downloadApproval: BrowserApprovalMode;
  uploadApproval: BrowserApprovalMode;
  historyApproval: BrowserApprovalMode;
  annotationScreenshots: AnnotationScreenshotMode;
  allowedDomains: string[];
  blockedDomains: string[];
  allowedDownloadDomains: string[];
  blockedDownloadDomains: string[];
  allowedUploadDomains: string[];
  blockedUploadDomains: string[];
};

export type RemoteConnectionRecord = {
  id: string;
  name: string;
  host: string;
  platform: string;
  version: string;
  requiredVersion: string;
  availability: RemoteConnectionAvailability;
  lastSeen: string;
};

export type ConnectionsSettingsModel = {
  remoteControlEnabled: boolean;
  allowSignedInPeers: boolean;
  minVersion: string;
  lastHeartbeat: string;
  displayName: string;
  remoteEnvironments: RemoteConnectionRecord[];
};

export type WorktreeRecord = {
  id: string;
  repository: string;
  branch: string;
  path: string;
  status: "active" | "dirty" | "stale";
  lastUsed: string;
  conversations: string[];
};

export type WorktreeSettingsModel = {
  defaultRoot: string;
  autoDetect: boolean;
  protectDirtyWorktrees: boolean;
  autoCleanup: boolean;
  keepCount: number;
  worktrees: WorktreeRecord[];
};

export type LocalEnvironmentScript = {
  defaultCommand: string;
  windowsCommand: string;
  macosCommand: string;
  linuxCommand: string;
};

export type LocalEnvironmentAction = {
  id: string;
  name: string;
  command: string;
  icon: LocalEnvironmentActionIcon;
  platforms: LocalEnvironmentPlatform[];
};

export type LocalEnvironmentRecord = {
  name: string;
  setup: LocalEnvironmentScript;
  cleanup: LocalEnvironmentScript;
  actions: LocalEnvironmentAction[];
};

export type LocalEnvironmentWorkspace = {
  id: string;
  name: string;
  rootPath: string;
  status: "ready" | "warning" | "unavailable";
  inheritedCount: number;
  environment: LocalEnvironmentRecord;
};

export type LocalEnvironmentsSettingsModel = {
  selectedWorkspaceId: string;
  workspaces: LocalEnvironmentWorkspace[];
};

export type SettingsModel = {
  general: GeneralSettingsModel;
  appearance: AppearanceSettingsModel;
  agent: AgentSettingsModel;
  account: AccountSettingsModel;
  browserUse: BrowserUseSettingsModel;
  connections: ConnectionsSettingsModel;
  worktrees: WorktreeSettingsModel;
  localEnvironments: LocalEnvironmentsSettingsModel;
};

export type BrowserDomainKind =
  | "allowedDomains"
  | "blockedDomains"
  | "allowedDownloadDomains"
  | "blockedDownloadDomains"
  | "allowedUploadDomains"
  | "blockedUploadDomains";

export type PersistedAppState = {
  schemaVersion: number;
  threads: ChatThread[];
  messagesByThread: Record<string, ConversationMessage[]>;
  activity: ActivityItem[];
  plugins: PluginDescriptor[];
  automations: AutomationRecord[];
  settings: SettingsModel;
  selectedThreadId: string;
  selectedAutomationId: string;
};

export type CreateThreadInput = Partial<
  Pick<ChatThread, "title" | "workspace" | "branch" | "summary" | "status" | "tags">
> & {
  initialMessage?: string;
};

export type CreateMessageInput = Omit<ConversationMessage, "id">;
