import { Box, Typography } from '../../ui';
import type { useTranslations } from '@/i18n/compat';
import type { ProjectDetailContentProps } from './types';

type ProjectDetailTechnologiesProps = {
  technologies: ProjectDetailContentProps['project']['technologies'];
  t: ReturnType<typeof useTranslations>;
};

export function ProjectDetailTechnologies(props: ProjectDetailTechnologiesProps) {
  if (props.technologies.length === 0) {
    return null;
  }

  return (
    <Box visualVariant="projectDetailContent">
      <Typography variant="overline" color="text.secondary">
        {props.t('technologies')}
      </Typography>
      <Typography color="text.secondary" visualVariant="projectDetailContent2">
        {props.technologies.join(' · ')}
      </Typography>
    </Box>
  );
}
