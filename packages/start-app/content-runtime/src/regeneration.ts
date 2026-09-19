import { watch } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type RegenerationScheduler = {
  schedule: () => void;
  cancel: () => void;
};

export type RegenerationOptions = {
  directories: readonly string[];
  regenerate: () => Promise<void>;
  watchMessage: string;
  failureMessage: string;
};

const DEBOUNCE_MS = 150;

class DebouncedRegeneration implements RegenerationScheduler {
  private readonly options: RegenerationOptions;
  private timer: NodeJS.Timeout | undefined;
  private generating = false;
  private pending = false;

  constructor(options: RegenerationOptions) {
    this.options = options;
  }

  schedule(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => void this.run(), DEBOUNCE_MS);
  }

  cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  private async run(): Promise<void> {
    if (this.generating) {
      this.pending = true;
      return;
    }
    this.generating = true;
    try {
      await this.options.regenerate();
    } catch (error) {
      console.error(this.options.failureMessage, error);
    }
    this.generating = false;
    if (!this.pending) {
      return;
    }
    this.pending = false;
    await this.run();
  }
}

export function createRegenerationScheduler(options: RegenerationOptions): RegenerationScheduler {
  return new DebouncedRegeneration(options);
}

export async function watchAndRegenerate(options: RegenerationOptions): Promise<void> {
  await options.regenerate();
  process.stdout.write(`${options.watchMessage}\n`);

  const scheduler = createRegenerationScheduler(options);
  const watchers = options.directories.map((directory) =>
    watch(directory, { recursive: true }, () => scheduler.schedule()),
  );
  const close = () => {
    for (const watcher of watchers) {
      watcher.close();
    }
    scheduler.cancel();
    process.exit();
  };
  process.once('SIGINT', close);
  process.once('SIGTERM', close);
}

export type RegenerationCliOptions = RegenerationOptions & {
  moduleUrl: string;
};

export function runRegenerationCli(options: RegenerationCliOptions): void {
  const executedDirectly = path.resolve(process.argv[1] ?? '') === fileURLToPath(options.moduleUrl);
  if (!executedDirectly) {
    return;
  }
  const command = process.argv.includes('--watch')
    ? watchAndRegenerate(options)
    : options.regenerate();
  command.catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
