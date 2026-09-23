import { ArchitectureDiagram } from './architecture-diagram';
import { createArchitectureApiDefinitions } from './architecture-api-definitions';
import type { IllustrationAccent } from './types';
import type { Translator } from '@/i18n/compat-support';

type ArchitectureApiProps = {
  accent: IllustrationAccent;
  t: Translator;
};

export function ArchitectureApi(props: ArchitectureApiProps) {
  const elements = createArchitectureApiDefinitions(props);

  return <ArchitectureDiagram definitions={elements} />;
}
