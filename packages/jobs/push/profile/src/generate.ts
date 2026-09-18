import type { ProfileReadmeSource } from './content.ts';
import { assertSafeOutputPath, writeFileAtomically } from './filesystem.ts';
import { renderProfileReadme } from './render.ts';

export type GenerateProfileReadmeOptions = {
  outputPath: string;
  workspaceReadmePath: string;
  source: ProfileReadmeSource;
};

export async function generateProfileReadme(props: GenerateProfileReadmeOptions): Promise<string> {
  const { outputPath, workspaceReadmePath, source } = props;
  assertSafeOutputPath(outputPath, workspaceReadmePath);
  const readme = renderProfileReadme(source);
  await writeFileAtomically(outputPath, readme);
  return readme;
}
