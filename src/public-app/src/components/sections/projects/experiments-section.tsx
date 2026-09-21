'use client';

import { EmptyState } from '../../content/empty-state';
import type { ExperimentsSectionProps } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExperimentsSectionContent } from './experiments-section-content';

export function ExperimentsSection(props: ExperimentsSectionProps) {
  const { experiments, hasProjects, tCommon } = props;

  if (experiments.length === 0) {
    return (
      <ConditionalContent
        condition={hasProjects}
        content={<EmptyState icon="problem">{tCommon('emptyExperiments')}</EmptyState>}
      />
    );
  }

  return <ExperimentsSectionContent {...props} />;
}
