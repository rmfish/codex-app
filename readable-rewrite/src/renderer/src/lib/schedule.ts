import type { AutomationSchedule } from "@shared/app-model";

export function formatScheduleSummary(schedule: AutomationSchedule): string {
  switch (schedule.mode) {
    case "daily":
      return `Every day at ${schedule.time}`;
    case "weekdays":
      return `Weekdays at ${schedule.time}`;
    case "weekly":
      return `${schedule.days.join(", ") || "Selected days"} at ${schedule.time}`;
    case "hourly":
      return `Every hour, anchored at ${schedule.time}`;
    case "interval":
      if (schedule.intervalMinutes > 0 && schedule.intervalMinutes < 60) {
        return `Every ${schedule.intervalMinutes} min`;
      }
      return `Every ${schedule.intervalHours}h`;
    case "custom":
      return schedule.customRrule || "Custom RRULE";
    default:
      return "Unknown schedule";
  }
}
