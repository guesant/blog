import { ArchitectureDiagram } from './architecture-diagram';
import { createArchitectureApplicationDefinitions } from './architecture-application-definitions';
import type { IllustrationAccent } from './types';
import type { IllustrationTranslator } from '@/i18n/compat-support';

type ArchitectureApplicationProps = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

export function ArchitectureApplication(props: ArchitectureApplicationProps) {
  const elements = createArchitectureApplicationDefinitions(props);

  return <ArchitectureDiagram definitions={elements} />;
}
