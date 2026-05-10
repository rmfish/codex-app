import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { selectCurrentThread, useAppStore } from "@/app/store";
import { ArrowUpIcon, ChevronDownIcon } from "@/components/AppIcons";

const HOME_MAIN_LABEL = "Main content";
const HOME_PROMPT_PLACEHOLDER = "Ask Codex anything. @ to use plugins or mention files";

function HomeComposerPill({
  label,
  showChevron = true,
}: {
  label: string;
  showChevron?: boolean;
}) {
  return (
    <button
      type="button"
      className={showChevron ? "codex-pill" : "codex-pill codex-pill--static"}
    >
      <span className="composer-footer__label--sm">{label}</span>
      {showChevron ? <ChevronDownIcon className="codex-pill__chevron" /> : null}
    </button>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const currentThread = useAppStore(selectCurrentThread);
  const createThread = useAppStore((state) => state.createThread);
  const [draft, setDraft] = useState("");
  const canSubmit = draft.trim().length > 0;

  useEffect(() => {
    setDraft("");
  }, [currentThread.id]);

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
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-panel">
              <div className="flex-1" />
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
              <div className="codex-composer">
                <div className="codex-composer__body">
                  <textarea
                    className="codex-composer__input"
                    placeholder={HOME_PROMPT_PLACEHOLDER}
                    spellCheck={false}
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </div>

                <div className="composer-footer codex-composer__footer">
                  <div className="codex-home__composer-pills">
                    <HomeComposerPill label="Default permissions" />
                    <HomeComposerPill label="Extra High" />
                    <HomeComposerPill label="Plan" showChevron={false} />
                  </div>
                  <div className="codex-composer__footer-right codex-composer__footer-right--standalone">
                    <button
                      type="submit"
                      className="codex-send-button size-token-button-composer"
                      disabled={!canSubmit}
                      aria-label="Send"
                    >
                      <ArrowUpIcon />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
