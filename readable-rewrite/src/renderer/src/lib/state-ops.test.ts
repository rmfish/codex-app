import { describe, expect, it } from "vitest";
import { createSeedAppState } from "@shared/seed-data";
import {
  addBrowserDomain,
  appendMessage,
  createThread,
} from "@shared/state-ops";

describe("shared state operations", () => {
  it("creates a new selected thread and seeds its first message", () => {
    const next = createThread(createSeedAppState(), {
      title: "Follow-up rewrite slice",
      initialMessage: "Rebuild the artifact viewer next.",
    });

    expect(next.selectedThreadId).toBe(next.threads[0].id);
    expect(next.threads[0].title).toBe("Follow-up rewrite slice");
    expect(next.messagesByThread[next.selectedThreadId]?.[0]?.content).toBe(
      "Rebuild the artifact viewer next.",
    );
  });

  it("normalizes browser domains before storing them", () => {
    const next = addBrowserDomain(
      createSeedAppState(),
      "allowedDomains",
      "https://Example.com/docs/path",
    );

    expect(next.settings.browserUse.allowedDomains).toContain("example.com");
  });

  it("ignores empty messages when appending", () => {
    const seed = createSeedAppState();
    const beforeCount = seed.messagesByThread[seed.selectedThreadId]?.length ?? 0;
    const next = appendMessage(seed, seed.selectedThreadId, {
      role: "user",
      content: "   ",
    });

    expect(next.messagesByThread[seed.selectedThreadId]?.length ?? 0).toBe(
      beforeCount,
    );
  });
});
