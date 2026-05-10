import { FileSearch, Hammer, Route } from "lucide-react";
import { useAppStore } from "@/app/store";
import { Panel } from "@/components/Panel";

export function ScratchpadPage() {
  const bootstrap = useAppStore((state) => state.bootstrap);

  return (
    <div className="page-grid page-grid--two-thirds">
      <Panel
        title="Rewrite scratchpad"
        subtitle="A clean room for notes, parity gaps, and interface decisions while rebuilding the extracted app."
      >
        <div className="stack">
          <div className="note-card">
            <strong>Phase 1</strong>
            <p>
              Recover the app shell, settings surfaces, and automation editor with
              mock data so every major product area becomes navigable and debuggable.
            </p>
          </div>
          <div className="note-card">
            <strong>Phase 2</strong>
            <p>
              Replace mock state with real repositories, workspace metadata, secure
              IPC flows, and connector-specific implementations.
            </p>
          </div>
          <div className="note-card">
            <strong>Phase 3</strong>
            <p>
              Rebuild the deeper bundle-only experiences such as artifact tabs,
              browser sandboxes, and advanced settings pages.
            </p>
          </div>
        </div>
      </Panel>

      <div className="stack">
        <Panel title="Recovered module leads" subtitle="Direct pointers for the next reconstruction pass.">
          <ul className="checklist">
            <li><Route size={14} /> `app-main-BssxuQ1L.js` lazy-loads most settings routes.</li>
            <li><FileSearch size={14} /> `apps-Cel-9d-y.js` contains the plugin and app catalog surface.</li>
            <li><Hammer size={14} /> `automations-page-CFQliMNR.js` and `automation-schedule-DrXsKRHC.js` back the schedule editor.</li>
          </ul>
        </Panel>

        <Panel title="Debug strategy" subtitle="Keep each reconstructed surface independently testable.">
          <ul className="checklist">
            <li>Prefer explicit stores and route components over giant context objects.</li>
            <li>Put every preload method behind a named allowlist and keep payloads typed.</li>
            <li>Preserve extracted feature names in docs so later engineers can trace parity decisions back to the bundles.</li>
          </ul>
        </Panel>

        <Panel title="Local persistence" subtitle="The desktop rewrite now keeps state in a real main-process store.">
          <div className="note-card">
            <strong>Data file</strong>
            <p>{bootstrap.dataFilePath}</p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
