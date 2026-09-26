import { ArchitectureDiagram } from './architecture-diagram';
import { createArchitectureDataDefinitions } from './architecture-data-definitions';
import type { IllustrationAccent } from './types';
import type { IllustrationTranslator } from '@/i18n/compat-support';

type ArchitectureDataProps = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

export function ArchitectureData(props: ArchitectureDataProps) {
  const elements = createArchitectureDataDefinitions(props);

  return <ArchitectureDiagram definitions={elements} />;
}
