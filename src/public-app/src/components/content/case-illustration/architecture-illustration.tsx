import { ArchitectureApi } from './architecture-api';
import { ArchitectureApplication } from './architecture-application';
import { ArchitectureData } from './architecture-data';
import type { IllustrationAccent } from './types';
import type { IllustrationTranslator } from '@/i18n/compat-support';

export type ArchitectureIllustrationProps = {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

export function ArchitectureIllustration(props: ArchitectureIllustrationProps) {
  return (
    <>
      <ArchitectureApplication accent={props.accent} t={props.t} />
      <ArchitectureApi accent={props.accent} t={props.t} />
      <ArchitectureData accent={props.accent} t={props.t} />
    </>
  );
}
