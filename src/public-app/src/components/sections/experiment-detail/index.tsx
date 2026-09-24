'use client';

import type { Experiment } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { DetailArticle } from '../../content/detail-layout';
import { ContentActions } from '../../content/content-actions';
import { DetailHeader } from '../../content/page-header';
import { ExperimentDetailBody } from './experiment-detail-body';

type ExperimentDetailContentProps = { experiment: Experiment };

export function ExperimentDetailContent(props: ExperimentDetailContentProps) {
  const { experiment: staticExperiment } = props;

  const t = useTranslations('Pages.projects');

  const tNav = useTranslations('Nav');

  const experiment = staticExperiment;

  return (
    <DetailArticle>
      <DetailHeader
        breadcrumbs={[{ label: tNav('projects'), href: '/projects' }, { label: experiment.name }]}
        title={experiment.name}
        description={experiment.purpose}
        meta={experiment.technologies.join(' · ')}
        actions={
          <ContentActions
            title={experiment.name}
            url={experiment.url ?? `/projects/experiments/${experiment.slug}`}
            body={experiment.body}
            externalUrl={experiment.href}
            placement="hero"
          />
        }
      />
      <ExperimentDetailBody experiment={experiment} t={t} />
    </DetailArticle>
  );
}
