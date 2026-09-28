import type { ProjectsTranslator } from '@/i18n/compat-support';
import type { ProjectDetailContentProps } from './types';
import { ProjectDetailContentLink } from '../../ui/semantic/ProjectDetailContentLink';

type ProjectDetailSourceProps = {
  href: ProjectDetailContentProps['project']['href'];
  t: ProjectsTranslator;
};

export function ProjectDetailSource(props: ProjectDetailSourceProps) {
  if (!props.href?.trim()) {
    return null;
  }

  return (
    <ProjectDetailContentLink href={props.href} underline="none">
      {props.t('source')}
    </ProjectDetailContentLink>
  );
}
