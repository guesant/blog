import { ExternalLink } from '../../primitives/external-link';
import type { ProjectsTranslator } from '@/i18n/compat-support';
import type { ProjectDetailContentProps } from './types';

type ProjectDetailSourceProps = {
  href: ProjectDetailContentProps['project']['href'];
  t: ProjectsTranslator;
};

export function ProjectDetailSource(props: ProjectDetailSourceProps) {
  if (!props.href?.trim()) {
    return null;
  }

  return (
    <ExternalLink href={props.href} underline="none" visualVariant="projectDetailContent">
      {props.t('source')}
    </ExternalLink>
  );
}
