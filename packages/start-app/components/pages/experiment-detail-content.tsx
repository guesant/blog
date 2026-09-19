'use client';

import Box from '@mui/material/Box';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Experiment } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { DetailArticle } from '../content/detail-layout';
import { DetailHeader } from '../content/page-header';
import { ExternalLink } from '../primitives/external-link';

type ExperimentDetailContentProps = { experiment: Experiment };

export function ExperimentDetailContent(props: ExperimentDetailContentProps) {
  const { experiment: staticExperiment } = props;
  const t = useTranslations('Pages.projects');
  const tNav = useTranslations('Nav');
  const { content: experiment, source } = useEditableContent(staticExperiment);

  return (
    <DetailArticle>
      <DetailHeader
        backHref="/projects"
        backLabel={t('back')}
        breadcrumbs={[{ label: tNav('projects'), href: '/projects' }, { label: experiment.name }]}
        eyebrow={t('experimentEyebrow')}
        title={experiment.name}
        description={experiment.purpose}
        meta={experiment.technologies.join(' · ')}
        editableProps={{
          title: getEditableProps(source, 'name'),
          description: getEditableProps(source, 'purpose'),
          meta: getEditableProps(source, 'technologies'),
        }}
      />
      {experiment.href?.trim() && (
        <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          <ExternalLink
            href={experiment.href}
            underline="none"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 600 }}
          >
            {t('source')}
          </ExternalLink>
        </Box>
      )}
    </DetailArticle>
  );
}
