import { ArchitectureDiagram } from './architecture-diagram';
import { createArchitectureApiDefinitions } from './architecture-api-definitions';
import type { IllustrationAccent } from './types';
import type { IllustrationTranslator } from '@/i18n/compat-support';

type ArchitectureApiProps = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

export function ArchitectureApi(props: ArchitectureApiProps) {
  const elements = createArchitectureApiDefinitions(props);

  return <ArchitectureDiagram definitions={elements} />;
}
