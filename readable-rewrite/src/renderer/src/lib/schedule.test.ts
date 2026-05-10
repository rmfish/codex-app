import { describe, expect, it } from "vitest";
import { formatScheduleSummary } from "@/lib/schedule";

describe("formatScheduleSummary", () => {
  it("formats weekday schedules", () => {
    expect(
      formatScheduleSummary({
        mode: "weekdays",
        time: "09:00",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        intervalHours: 24,
        intervalMinutes: 60,
        customRrule: "",
      }),
    ).toBe("Weekdays at 09:00");
  });

  it("formats interval schedules with minutes", () => {
    expect(
      formatScheduleSummary({
        mode: "interval",
        time: "09:00",
        days: [],
        intervalHours: 1,
        intervalMinutes: 30,
        customRrule: "",
      }),
    ).toBe("Every 30 min");
  });
});
