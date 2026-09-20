'use client';

import { Typography } from '../../ui';
import { EmptyState } from '../../content/empty-state';
import { ListingView } from '../../content/listing-view';
import type { ExperimentsSectionProps } from './types';
import { ExperimentRow } from './experiment-row';
import { ConditionalContent } from '../../primitives/conditional-content';

export function ExperimentsSection(props: ExperimentsSectionProps) {
  const { experiments, hasProjects, page, tCommon } = props;

  if (experiments.length === 0) {
    return (
      <ConditionalContent
        condition={hasProjects}
        content={<EmptyState icon="problem">{tCommon('emptyExperiments')}</EmptyState>}
      />
    );
  }

  return (
    <>
      <Typography
        id="experiments"
        variant="overline"
        color="text.secondary"
        visualVariant="experimentsSection"
      >
        {page.archiveLabel}
      </Typography>
      <Typography component="h2" variant="h5" visualVariant="experimentsSection2">
        {page.experimentsTitle}
      </Typography>
      <ListingView
        items={experiments}
        getKey={(item) => item.slug}
        renderListItem={(item) => <ExperimentRow item={item} />}
      />
    </>
  );
}
