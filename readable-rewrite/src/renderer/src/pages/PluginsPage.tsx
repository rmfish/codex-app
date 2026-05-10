import { KeyRound, Link2, PlugZap, ShieldAlert } from "lucide-react";
import { Panel } from "@/components/Panel";
import { useAppStore } from "@/app/store";

function actionLabel(status: "connected" | "available" | "disabled") {
  if (status === "connected") return "Disable";
  if (status === "disabled") return "Re-enable";
  return "Connect";
}

export function PluginsPage() {
  const plugins = useAppStore((state) => state.plugins);
  const togglePluginConnection = useAppStore(
    (state) => state.togglePluginConnection,
  );

  return (
    <div className="page-grid page-grid--two-thirds">
      <Panel
        title="Plugin and connector catalog"
        subtitle="Rebuilt from the plugins route, apps bundles, and OAuth callback flow references."
      >
        <div className="plugin-grid">
          {plugins.map((plugin) => (
            <article key={plugin.id} className="plugin-card">
              <div className="plugin-card__header">
                <div>
                  <p className="eyebrow">{plugin.category}</p>
                  <h3>{plugin.name}</h3>
                </div>
                <span className={`chip chip--${plugin.status}`}>{plugin.status}</span>
              </div>

              <p>{plugin.description}</p>

              <div className="fact-list">
                <div className="fact-row">
                  <Link2 size={15} />
                  <div>
                    <strong>Transport</strong>
                    <p>{plugin.transport}</p>
                  </div>
                </div>
                <div className="fact-row">
                  <KeyRound size={15} />
                  <div>
                    <strong>Scopes</strong>
                    <p>{plugin.scopes.join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="plugin-card__footer">
                <p>{plugin.riskNote}</p>
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => togglePluginConnection(plugin.id)}
                >
                  {actionLabel(plugin.status)}
                </button>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <div className="stack">
        <Panel
          title="OAuth callback and trust boundary"
          subtitle="The extracted renderer included a dedicated OAuth callback page and connector completion flow."
          actions={<PlugZap size={16} />}
        >
          <div className="note-card">
            <strong>Why this matters</strong>
            <p>
              Connected apps are no longer hidden behind bundle-local side effects.
              The rewrite keeps the callback flow explicit, inspectable, and easy to
              mock during debugging.
            </p>
          </div>
          <div className="chip-row">
            <span className="chip">app-connect-oauth</span>
            <span className="chip">callback page</span>
            <span className="chip">scope review</span>
          </div>
        </Panel>

        <Panel
          title="Security review prompts"
          subtitle="Use these checks when porting individual integrations from the extracted app."
          actions={<ShieldAlert size={16} />}
        >
          <ul className="checklist">
            <li>Confirm each connector exposes its scopes before the user approves it.</li>
            <li>Keep OAuth completion and app-connect IPC separate from general renderer state.</li>
            <li>Log connected-app provenance anywhere connector output appears in a conversation.</li>
            <li>Prefer revocable, per-workspace permissions over global grants.</li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
