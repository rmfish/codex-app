import { Braces, FileSearch, ShieldCheck, Sparkles } from "lucide-react";
import { Panel } from "@/components/Panel";

const skills = [
  {
    name: "Window parity mapping",
    description:
      "Tracks which visible Electron shell details have already been reconstructed from the extracted bundles.",
    tag: "UI parity",
  },
  {
    name: "Bundle inventory",
    description:
      "Records the routes, labels, and states that were recovered from the original app-main and app-shell chunks.",
    tag: "Reverse engineering",
  },
  {
    name: "Security boundary review",
    description:
      "Keeps the rewrite aligned with the original preload isolation and renderer safety constraints.",
    tag: "Security",
  },
];

export function SkillsPage() {
  return (
    <div className="page-grid page-grid--two-thirds">
      <Panel
        title="Skills"
        subtitle="Readable versions of the capability surfaces discovered in the extracted Electron renderer."
      >
        <div className="plugin-grid">
          {skills.map((skill) => (
            <article key={skill.name} className="plugin-card">
              <div className="plugin-card__header">
                <div>
                  <p className="eyebrow">{skill.tag}</p>
                  <h3>{skill.name}</h3>
                </div>
                <span className="chip chip--connected">available</span>
              </div>
              <p>{skill.description}</p>
            </article>
          ))}
        </div>
      </Panel>

      <div className="stack">
        <Panel
          title="Recovered inputs"
          subtitle="These references currently drive the strict window-by-window rewrite."
          actions={<FileSearch size={16} />}
        >
          <ul className="checklist">
            <li>Original `app-shell` structure and toolbar behavior.</li>
            <li>Original `app-main` labels for Skills, Plugins, Automations, Projects, and Chats.</li>
            <li>Original CSS token system and main-surface theme variables.</li>
          </ul>
        </Panel>

        <Panel
          title="Boundary checks"
          subtitle="The visible shell can change, but the desktop security posture should not regress."
          actions={<ShieldCheck size={16} />}
        >
          <div className="fact-list">
            <div className="fact-row">
              <Braces size={15} />
              <div>
                <strong>Readable source first</strong>
                <p>Each recovered surface is rewritten as explicit React and Electron modules.</p>
              </div>
            </div>
            <div className="fact-row">
              <Sparkles size={15} />
              <div>
                <strong>Parity over approximation</strong>
                <p>The current focus is strict 1:1 reconstruction of the visible window.</p>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
