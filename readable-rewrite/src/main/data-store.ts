import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { PersistedAppState } from "../shared/app-model";
import { createSeedAppState } from "../shared/seed-data";
import {
  getPersistedStateCopy,
  normalizePersistedAppState,
} from "../shared/state-ops";

export class AppDataStore {
  private state: PersistedAppState | null = null;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(private readonly filePath: string) {}

  getFilePath() {
    return this.filePath;
  }

  async load() {
    if (this.state) {
      return this.state;
    }

    await mkdir(dirname(this.filePath), { recursive: true });

    try {
      const raw = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as Partial<PersistedAppState>;
      this.state = normalizePersistedAppState(parsed);
    } catch (error) {
      const nodeError = error as NodeJS.ErrnoException;
      if (nodeError.code !== "ENOENT") {
        console.warn("[data-store] failed to read persisted state, using seed", error);
      }

      this.state = createSeedAppState();
      await this.persist(this.state);
    }

    return this.state;
  }

  async getSnapshot() {
    const state = await this.load();
    return getPersistedStateCopy(state);
  }

  async update(
    updater: (current: PersistedAppState) => PersistedAppState,
  ): Promise<PersistedAppState> {
    const current = await this.load();
    const next = normalizePersistedAppState(updater(getPersistedStateCopy(current)));
    this.state = next;
    await this.persist(next);
    return getPersistedStateCopy(next);
  }

  private async persist(snapshot: PersistedAppState) {
    this.writeChain = this.writeChain.then(async () => {
      await mkdir(dirname(this.filePath), { recursive: true });
      await writeFile(this.filePath, JSON.stringify(snapshot, null, 2), "utf8");
    });

    await this.writeChain;
  }
}
