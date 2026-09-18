import { randomUUID } from 'node:crypto';
import { rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export function assertSafeOutputPath(outputPath: string, workspaceReadmePath: string): void {
  if (path.resolve(outputPath) === path.resolve(workspaceReadmePath)) {
    throw new Error('Refusing to overwrite the portfolio root README.md');
  }
}

export async function writeFileAtomically(outputPath: string, content: string): Promise<void> {
  const destination = path.resolve(outputPath);
  const temporaryPath = path.join(
    path.dirname(destination),
    `.${path.basename(destination)}.${process.pid}.${randomUUID()}.tmp`,
  );

  try {
    await writeFile(temporaryPath, content, 'utf8');
    await rename(temporaryPath, destination);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
}
