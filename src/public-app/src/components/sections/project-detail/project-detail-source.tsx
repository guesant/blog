import { ExternalLink } from '../../primitives/external-link';
import type { useTranslations } from '@/i18n/compat';
import type { ProjectDetailContentProps } from './types';

type ProjectDetailSourceProps = {
  href: ProjectDetailContentProps['project']['href'];
  t: ReturnType<typeof useTranslations>;
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
