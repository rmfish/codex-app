import { useState } from "react";
import {
  ArrowUp,
  Bot,
  CheckCircle2,
  FileCode2,
  FolderOpen,
  GitBranch,
  MessageSquareText,
  TerminalSquare,
} from "lucide-react";
import { selectCurrentThread, useAppStore } from "@/app/store";

type ThreadArtifact = {
  label: string;
  meta: string;
  path: string;
};

type ThreadFixture = {
  activitySummary: string;
  activityDetail: string;
  paragraphs: string[];
  checklist: string[];
  changedFiles: string[];
  artifacts: ThreadArtifact[];
  composerHint: string;
};

const threadFixtures: Record<string, ThreadFixture> = {
  "thread-rewrite-plan": {
    activitySummary: "Mapped the extracted shell and rebuilt the visible Codex window.",
    activityDetail:
      "Recovered sidebar grouping, transcript hierarchy, and right-panel titles from the original bundles.",
    paragraphs: [
      "I replaced the generic dashboard scaffolding with a thread-first layout that follows the visible Electron window much more closely.",
      "The rewrite now keeps the secure preload boundary and persisted desktop store, while the renderer is organized into readable components that match the original shell instead of opaque minified panels.",
    ],
    checklist: [
      "Align the left sidebar labels, ordering, and disabled Plugins state with the extracted Electron app.",
      "Render the center area as a Codex-style transcript with tool activity, markdown-like answer content, and a changed-files summary.",
      "Mirror the right rail as Progress, Artifacts, and Side chats so the visible window structure stays 1:1 with the original surface.",
    ],
    changedFiles: [
      "src/shared/app-model.ts",
      "src/shared/state-ops.ts",
      "src/renderer/src/pages/settings/sections.tsx",
      "src/shared/seed-data.ts",
    ],
    artifacts: [
      {
        label: "Shell layout",
        meta: "Electron window structure",
        path: "src/renderer/src/components/Shell.tsx",
      },
      {
        label: "Thread transcript",
        meta: "Main conversation viewport",
        path: "src/renderer/src/pages/DashboardPage.tsx",
      },
      {
        label: "Theme tokens",
        meta: "Original Codex surfaces",
        path: "src/renderer/src/original/app-main.css",
      },
      {
        label: "Window styling",
        meta: "Gap-fill rules for parity",
        path: "src/renderer/src/styles.css",
      },
    ],
    composerHint:
      "Describe the next strict 1:1 parity gap to rebuild in this readable Electron project.",
  },
  "thread-plugin-audit": {
    activitySummary: "Compared the visible sidebar routes against the extracted plugin and skills bundles.",
    activityDetail:
      "Confirmed that Skills is visible, Plugins can be disabled, and Automations appears as a dedicated route in Electron.",
    paragraphs: [
      "This thread tracks the split between the Skills route, disabled Plugins messaging, and the richer connector pages that sit behind authentication.",
    ],
    checklist: [
      "Keep the left-nav labels source-aligned.",
      "Preserve disabled-state messaging for Plugins.",
      "Expose connector details in readable React components.",
    ],
    changedFiles: [
      "src/renderer/src/pages/PluginsPage.tsx",
      "src/renderer/src/components/Shell.tsx",
    ],
    artifacts: [
      {
        label: "Connector catalog",
        meta: "Plugins route",
        path: "src/renderer/src/pages/PluginsPage.tsx",
      },
      {
        label: "Sidebar nav",
        meta: "Skills and Plugins states",
        path: "src/renderer/src/components/Shell.tsx",
      },
    ],
    composerHint: "Capture the next plugin or skills parity detail to port from the extracted app.",
  },
  "thread-remote-control": {
    activitySummary: "Reviewed remote control and connection settings against the current preload bridge.",
    activityDetail:
      "Checked how the readable store and settings panels can preserve the original security posture.",
    paragraphs: [
      "This thread focuses on the remote-control settings surface and the security-sensitive state that should stay explicit in the rewrite.",
    ],
    checklist: [
      "Keep context isolation and narrow IPC channels intact.",
      "Make connection state readable in settings.",
      "Avoid hidden side effects from the extracted bundles.",
    ],
    changedFiles: [
      "src/main/data-store.ts",
      "src/shared/app-model.ts",
      "src/renderer/src/pages/settings/sections.tsx",
    ],
    artifacts: [
      {
        label: "Persisted store",
        meta: "Desktop JSON state",
        path: "src/main/data-store.ts",
      },
      {
        label: "Settings sections",
        meta: "Remote control and settings UI",
        path: "src/renderer/src/pages/settings/sections.tsx",
      },
    ],
    composerHint: "Describe the next remote-control or settings behavior to rebuild.",
  },
};

function getFixture(threadId: string): ThreadFixture {
  return (
    threadFixtures[threadId] ?? {
      activitySummary: "Queued the next parity task for the readable rewrite.",
      activityDetail:
        "This thread can be used to track another visible shell or interaction gap from the original Electron app.",
      paragraphs: [
        "The rewrite keeps the window structure readable and debuggable while preserving the visible product shape.",
      ],
      checklist: [
        "Inspect the extracted bundle for the missing behavior.",
        "Rebuild it in a readable React or Electron module.",
        "Verify that the visible window still matches the original surface.",
      ],
      changedFiles: [
        "src/renderer/src/pages/DashboardPage.tsx",
        "src/renderer/src/components/Shell.tsx",
      ],
      artifacts: [
        {
          label: "Thread surface",
          meta: "Conversation page",
          path: "src/renderer/src/pages/DashboardPage.tsx",
        },
      ],
      composerHint: "Describe the next parity task.",
    }
  );
}

export function DashboardPage() {
  const currentThread = useAppStore(selectCurrentThread);
  const threads = useAppStore((state) => state.threads);
  const messages = useAppStore(
    (state) => state.messagesByThread[currentThread.id] ?? [],
  );
  const activity = useAppStore((state) => state.activity);
  const appendMessage = useAppStore((state) => state.appendMessage);
  const selectThread = useAppStore((state) => state.selectThread);
  const [draft, setDraft] = useState("");
  const fixture = getFixture(currentThread.id);
  const progressItems = activity.slice(0, 3);
  const visibleArtifacts = fixture.artifacts.slice(0, 3);
  const sideChats = threads.filter((thread) => thread.id !== currentThread.id).slice(0, 3);
  const firstUser = messages.find((message) => message.role === "user");
  const firstAssistant = messages.find((message) => message.role === "assistant");
  const firstTool = messages.find((message) => message.role === "tool");
  const hasConversation = messages.length > 0;
  const renderedIds = new Set(
    [firstUser?.id, firstAssistant?.id, firstTool?.id].filter(Boolean),
  );
  const trailingMessages = messages.filter((message) => !renderedIds.has(message.id));

  return (
    <div className="thread-page">
      <section className="thread-page__main">
        <header className="thread-header">
          <div>
            <p className="eyebrow">Local conversation</p>
            <h2>{currentThread.title}</h2>
          </div>
          <div className="thread-header__meta">
            <span className="chip chip--subtle">
              <FolderOpen size={13} />
              {currentThread.workspace}
            </span>
            <span className="chip chip--subtle">
              <GitBranch size={13} />
              {currentThread.branch}
            </span>
            <span className="chip chip--success">{currentThread.status}</span>
          </div>
        </header>

        <div className="thread-scroll">
          {hasConversation ? (
            <>
              {firstUser ? (
                <article className="thread-bubble thread-bubble--user">
                  <header className="thread-bubble__header">
                    <strong>You</strong>
                  </header>
                  <p>{firstUser.content}</p>
                </article>
              ) : null}

              <div className="thread-activity">
                <TerminalSquare size={15} />
                <div>
                  <strong>{fixture.activitySummary}</strong>
                  <p>{fixture.activityDetail}</p>
                </div>
              </div>

              <article className="thread-answer">
                <header className="thread-answer__header">
                  <div className="thread-answer__avatar">
                    <Bot size={15} />
                  </div>
                  <div>
                    <strong>Codex</strong>
                    <p>Readable rewrite preview</p>
                  </div>
                </header>

                <div className="thread-answer__body">
                  <p>{firstAssistant?.content ?? fixture.paragraphs[0]}</p>
                  {fixture.paragraphs
                    .slice(firstAssistant ? 0 : 1)
                    .map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  <ol>
                    {fixture.checklist.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>

                <section className="thread-change-card">
                  <header className="thread-change-card__header">
                    <div>
                      <strong>Changed files</strong>
                      <p>{fixture.changedFiles.length} files updated in the readable rewrite</p>
                    </div>
                    <FileCode2 size={16} />
                  </header>
                  <div className="thread-change-card__list">
                    {fixture.changedFiles.map((file) => (
                      <div key={file} className="thread-change-card__row">
                        <span>{file}</span>
                        <CheckCircle2 size={14} />
                      </div>
                    ))}
                  </div>
                </section>
              </article>

              {firstTool ? (
                <div className="thread-inline-note">
                  <TerminalSquare size={14} />
                  <div>
                    <strong>{firstTool.meta ?? "Recovered bundle scan"}</strong>
                    <p>{firstTool.content}</p>
                  </div>
                </div>
              ) : null}

              {trailingMessages.map((message) => (
                <article
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "thread-bubble thread-bubble--user"
                      : "thread-bubble"
                  }
                >
                  <header className="thread-bubble__header">
                    <strong>
                      {message.role === "assistant"
                        ? "Codex"
                        : message.role === "tool"
                          ? "Tool"
                          : "You"}
                    </strong>
                    {message.meta ? <span>{message.meta}</span> : null}
                  </header>
                  <p>{message.content}</p>
                </article>
              ))}
            </>
          ) : (
            <section className="thread-empty-state">
              <div className="thread-answer__avatar">
                <Bot size={15} />
              </div>
              <div className="thread-empty-state__copy">
                <strong>Start a new parity pass</strong>
                <p>
                  This thread is empty. Capture the next 1:1 rewrite slice from the
                  extracted Electron app and continue from the current window.
                </p>
              </div>
              <div className="thread-composer__chips">
                <span className="chip chip--subtle">{currentThread.workspace}</span>
                <span className="chip chip--subtle">{currentThread.branch}</span>
                <span className="chip chip--subtle">{currentThread.status}</span>
              </div>
            </section>
          )}
        </div>

        <form
          className="thread-composer"
          onSubmit={(event) => {
            event.preventDefault();
            const value = draft.trim();
            if (!value) {
              return;
            }
            void appendMessage(currentThread.id, {
              role: "user",
              content: value,
              meta: "local task",
            });
            setDraft("");
          }}
        >
          <textarea
            id="thread-composer-input"
            data-codex-composer="true"
            className="thread-composer__input"
            placeholder={fixture.composerHint}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <div className="thread-composer__footer">
            <div className="thread-composer__chips">
              <span className="chip chip--subtle">gpt-5.5</span>
              <span className="chip chip--subtle">danger-full-access</span>
              <span className="chip chip--subtle">{currentThread.workspace}</span>
            </div>
            <button
              className="button button--primary thread-composer__send"
              type="submit"
              disabled={!draft.trim()}
            >
              <ArrowUp size={14} />
              Send
            </button>
          </div>
        </form>
      </section>

      <aside className="thread-side-panel">
        <section className="thread-side-card">
          <header className="thread-side-card__header">
            <h3>Progress</h3>
            <span>{progressItems.length}</span>
          </header>
          <div className="thread-side-card__body">
            {progressItems.map((item) => (
              <article key={item.id} className="thread-side-row">
                <div className={`timeline__dot timeline__dot--${item.kind}`} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <span>{item.timestamp}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="thread-side-card">
          <header className="thread-side-card__header">
            <h3>Artifacts</h3>
            <span>{visibleArtifacts.length}</span>
          </header>
          <div className="thread-side-card__body">
            {visibleArtifacts.map((artifact) => (
              <article key={artifact.path} className="thread-artifact">
                <div className="thread-artifact__icon">
                  <FileCode2 size={15} />
                </div>
                <div>
                  <strong>{artifact.label}</strong>
                  <p>{artifact.meta}</p>
                  <span>{artifact.path}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="thread-side-card">
          <header className="thread-side-card__header">
            <h3>Side chats</h3>
            <span>{sideChats.length}</span>
          </header>
          <div className="thread-side-card__body">
            {sideChats.map((thread) => (
              <button
                key={thread.id}
                type="button"
                className="thread-side-chat"
                onClick={() => {
                  void selectThread(thread.id);
                }}
              >
                <div>
                  <strong>{thread.title}</strong>
                  <p>{thread.summary}</p>
                </div>
                <span>{thread.updatedAt}</span>
              </button>
            ))}
            {!sideChats.length ? (
              <div className="thread-side-empty">
                <MessageSquareText size={15} />
                <span>No side chats yet</span>
              </div>
            ) : null}
          </div>
        </section>
      </aside>
    </div>
  );
}
