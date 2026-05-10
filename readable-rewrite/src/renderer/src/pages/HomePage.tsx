import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectCurrentThread, useAppStore } from "@/app/store";
import {
  ArrowUpIcon,
  BranchIcon,
  ChevronDownIcon,
  ClockIcon,
  CodexIcon,
  FolderIcon,
  GlobeIcon,
  HomepageLogoIcon,
} from "@/components/AppIcons";

const HOME_MAIN_LABEL = "Main content";
const HOME_PROMPT_PLACEHOLDER = "What should we build?";

const SUGGESTION_CARDS = [
  {
    id: "connect-messaging",
    title: "Connect messaging",
    description: "Set up a chat connector to pull messages into context.",
    icon: GlobeIcon,
  },
  {
    id: "connect-github",
    title: "Connect GitHub",
    description: "Link repositories, pull requests, and issue context.",
    icon: CodexIcon,
  },
  {
    id: "connect-linear",
    title: "Connect Linear",
    description: "Bring project tickets and workflow state into the thread.",
    icon: ClockIcon,
  },
  {
    id: "connect-email",
    title: "Connect email",
    description: "Make inbox threads and follow-ups available to Codex.",
    icon: FolderIcon,
  },
] as const;

function ComposerChip({
  label,
  icon,
  showChevron = true,
  subtle = false,
}: {
  label: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  showChevron?: boolean;
  subtle?: boolean;
}) {
  const Icon = icon;

  return (
    <button
      type="button"
      className={
        subtle
          ? "codex-home-chip codex-home-chip--subtle"
          : "codex-home-chip"
      }
    >
      {Icon ? (
        <span className="codex-home-chip__icon">
          <Icon />
        </span>
      ) : null}
      <span>{label}</span>
      {showChevron ? (
        <ChevronDownIcon className="codex-home-chip__chevron" />
      ) : null}
    </button>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const currentThread = useAppStore(selectCurrentThread);
  const bootstrap = useAppStore((state) => state.bootstrap);
  const createThread = useAppStore((state) => state.createThread);
  const [draft, setDraft] = useState("");
  const canSubmit = draft.trim().length > 0;

  useEffect(() => {
    setDraft("");
  }, [currentThread.id]);

  const workspaceLabel = useMemo(() => {
    return currentThread.workspace?.trim() || "app-readable";
  }, [currentThread.workspace]);

  const branchLabel = useMemo(() => {
    return currentThread.branch?.trim() || "main";
  }, [currentThread.branch]);

  const accessLabel =
    bootstrap.platform === "browser" ? "Full access" : "Full access";

  return (
    <div className="codex-home">
      <div
        className="flex h-full flex-col"
        data-vscode-context='{"chatgpt.supportsNewChatMenu": true}'
        tabIndex={0}
      >
        <div className="relative flex h-full flex-col">
          <div
            className="[container-type:size] relative flex w-full flex-1 flex-col items-center justify-center overflow-hidden [container-name:home-main-content]"
            role="main"
            aria-label={HOME_MAIN_LABEL}
          >
            <div className="codex-home__hero px-panel">
              <div className="codex-home__logo-wrap">
                <HomepageLogoIcon className="codex-home__logo" />
              </div>

              <h1 className="codex-home__title">
                What should we build in {workspaceLabel}?
              </h1>

              <div className="codex-home__cards" aria-label="Suggestions">
                {SUGGESTION_CARDS.map(({ description, icon: Icon, id, title }) => (
                  <button key={id} type="button" className="codex-home-card">
                    <span className="codex-home-card__icon">
                      <Icon />
                    </span>
                    <span className="codex-home-card__copy">
                      <strong>{title}</strong>
                      <span>{description}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="z-10 -mt-[var(--thread-footer-overlap)] flex flex-col gap-2 pb-2">
            <div className="home-banners mt-2 flex flex-col gap-2 empty:hidden" />

            <form
              className="mx-auto w-full max-w-3xl px-panel"
              onSubmit={async (event) => {
                event.preventDefault();
                const value = draft.trim();
                if (!value) {
                  return;
                }

                await createThread({
                  title: value.replace(/\s+/g, " ").trim().slice(0, 80),
                  workspace: currentThread.workspace,
                  branch: currentThread.branch,
                  status: "draft",
                  initialMessage: value,
                });
                setDraft("");

                const nextThreadId = useAppStore.getState().selectedThreadId;
                if (nextThreadId) {
                  navigate(`/thread/${nextThreadId}`);
                }
              }}
            >
              <div className="codex-home-composer">
                <div className="codex-home-composer__input-wrap">
                  <textarea
                    className="codex-home-composer__input"
                    placeholder={HOME_PROMPT_PLACEHOLDER}
                    spellCheck={false}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </div>

                <div className="codex-home-composer__footer">
                  <div className="codex-home-composer__controls">
                    <ComposerChip label={accessLabel} icon={GlobeIcon} />
                  </div>

                  <div className="codex-home-composer__actions">
                    <ComposerChip label="custom" subtle />
                    <ComposerChip label="5.4" />
                    <ComposerChip label="Extra High" />
                    <button
                      type="submit"
                      className="codex-home-send-button size-token-button-composer"
                      disabled={!canSubmit}
                      aria-label="Send"
                    >
                      <ArrowUpIcon />
                    </button>
                  </div>
                </div>
              </div>

              <div className="codex-home-meta">
                <div className="codex-home-meta__item">
                  <FolderIcon />
                  <span>{workspaceLabel}</span>
                </div>
                <div className="codex-home-meta__item">
                  <GlobeIcon />
                  <span>Work locally</span>
                </div>
                <div className="codex-home-meta__item">
                  <BranchIcon />
                  <span>{branchLabel}</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
