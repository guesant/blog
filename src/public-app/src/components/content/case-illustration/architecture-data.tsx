import { ArchitectureDiagram } from './architecture-diagram';
import { createArchitectureDataDefinitions } from './architecture-data-definitions';
import type { IllustrationAccent } from './types';
import type { Translator } from '@/i18n/compat-support';

type ArchitectureDataProps = {
  accent: IllustrationAccent;
  t: Translator;
};

export function ArchitectureData(props: ArchitectureDataProps) {
  const elements = createArchitectureDataDefinitions(props);

  return <ArchitectureDiagram definitions={elements} />;
}
