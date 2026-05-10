import { Clock3, PauseCircle, PlayCircle } from "lucide-react";
import { Panel } from "@/components/Panel";
import { formatScheduleSummary } from "@/lib/schedule";
import { selectCurrentAutomation, useAppStore } from "@/app/store";
import type { ScheduleMode } from "@shared/app-model";

const weekdayOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function AutomationsPage() {
  const automations = useAppStore((state) => state.automations);
  const selectedAutomation = useAppStore(selectCurrentAutomation);
  const selectAutomation = useAppStore((state) => state.selectAutomation);
  const updateAutomation = useAppStore((state) => state.updateAutomation);
  const updateAutomationSchedule = useAppStore(
    (state) => state.updateAutomationSchedule,
  );

  return (
    <div className="page-grid page-grid--three">
      <Panel
        title="Automation runs"
        subtitle="The extracted app exposed a dedicated automation page and a schedule editor. This rewrite makes the rule state inspectable."
      >
        <div className="automation-list">
          {automations.map((automation) => (
            <button
              key={automation.id}
              type="button"
              className={
                automation.id === selectedAutomation.id
                  ? "automation-card automation-card--active"
                  : "automation-card"
              }
              onClick={() => selectAutomation(automation.id)}
            >
              <div className="thread-card__top">
                <strong>{automation.name}</strong>
                <span>{automation.status}</span>
              </div>
              <p>{automation.workspace}</p>
              <div className="chip-row">
                <span className="chip chip--subtle">{automation.lastRun}</span>
                <span className="chip">{formatScheduleSummary(automation.schedule)}</span>
              </div>
            </button>
          ))}
        </div>
      </Panel>

      <Panel
        title={selectedAutomation.name}
        subtitle={selectedAutomation.workspace}
        actions={
          <button
            className="button button--ghost"
            type="button"
            onClick={() =>
              updateAutomation(selectedAutomation.id, {
                status:
                  selectedAutomation.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
                nextRun:
                  selectedAutomation.status === "ACTIVE"
                    ? "Paused"
                    : "Preview run after save",
              })
            }
          >
            {selectedAutomation.status === "ACTIVE" ? (
              <>
                <PauseCircle size={16} />
                Pause
              </>
            ) : (
              <>
                <PlayCircle size={16} />
                Resume
              </>
            )}
          </button>
        }
      >
        <div className="stack stack--compact">
          <div className="metadata-grid">
            <div className="metadata-card">
              <Clock3 size={16} />
              <div>
                <span>Last run</span>
                <strong>{selectedAutomation.lastRun}</strong>
              </div>
            </div>
            <div className="metadata-card">
              <Clock3 size={16} />
              <div>
                <span>Next run</span>
                <strong>{selectedAutomation.nextRun}</strong>
              </div>
            </div>
          </div>

          <label className="field">
            <span>Prompt</span>
            <textarea
              className="input textarea"
              value={selectedAutomation.prompt}
              onChange={(event) =>
                updateAutomation(selectedAutomation.id, {
                  prompt: event.target.value,
                })
              }
            />
          </label>

          <label className="field">
            <span>Notes</span>
            <textarea
              className="input textarea textarea--small"
              value={selectedAutomation.notes}
              onChange={(event) =>
                updateAutomation(selectedAutomation.id, {
                  notes: event.target.value,
                })
              }
            />
          </label>
        </div>
      </Panel>

      <Panel
        title="Schedule builder"
        subtitle="Human-readable schedule controls instead of opaque bundle form state."
      >
        <div className="stack stack--compact">
          <label className="field">
            <span>Mode</span>
            <select
              className="input"
              value={selectedAutomation.schedule.mode}
              onChange={(event) =>
                updateAutomationSchedule(selectedAutomation.id, {
                  mode: event.target.value as ScheduleMode,
                })
              }
            >
              <option value="daily">Daily</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekly">Weekly</option>
              <option value="hourly">Hourly</option>
              <option value="interval">Interval</option>
              <option value="custom">Custom</option>
            </select>
          </label>

          <label className="field">
            <span>Time</span>
            <input
              className="input"
              type="time"
              value={selectedAutomation.schedule.time}
              onChange={(event) =>
                updateAutomationSchedule(selectedAutomation.id, {
                  time: event.target.value,
                })
              }
            />
          </label>

          {selectedAutomation.schedule.mode === "interval" ? (
            <>
              <label className="field">
                <span>Interval hours</span>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={selectedAutomation.schedule.intervalHours}
                  onChange={(event) =>
                    updateAutomationSchedule(selectedAutomation.id, {
                      intervalHours: Number(event.target.value),
                    })
                  }
                />
              </label>
              <label className="field">
                <span>Interval minutes</span>
                <input
                  className="input"
                  type="number"
                  min={1}
                  value={selectedAutomation.schedule.intervalMinutes}
                  onChange={(event) =>
                    updateAutomationSchedule(selectedAutomation.id, {
                      intervalMinutes: Number(event.target.value),
                    })
                  }
                />
              </label>
            </>
          ) : null}

          {selectedAutomation.schedule.mode === "weekly" ? (
            <div className="field">
              <span>Days</span>
              <div className="chip-row">
                {weekdayOptions.map((day) => {
                  const isSelected =
                    selectedAutomation.schedule.days.includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      className={isSelected ? "chip chip--selected" : "chip"}
                      onClick={() => {
                        const days = isSelected
                          ? selectedAutomation.schedule.days.filter(
                              (value) => value !== day,
                            )
                          : [...selectedAutomation.schedule.days, day];
                        updateAutomationSchedule(selectedAutomation.id, { days });
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {selectedAutomation.schedule.mode === "custom" ? (
            <label className="field">
              <span>RRULE</span>
              <textarea
                className="input textarea textarea--small"
                value={selectedAutomation.schedule.customRrule}
                onChange={(event) =>
                  updateAutomationSchedule(selectedAutomation.id, {
                    customRrule: event.target.value,
                  })
                }
              />
            </label>
          ) : null}

          <div className="note-card">
            <strong>Summary</strong>
            <p>{formatScheduleSummary(selectedAutomation.schedule)}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
