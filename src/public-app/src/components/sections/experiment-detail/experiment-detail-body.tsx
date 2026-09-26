import { Box } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import type { Experiment } from '@portfolio/data/domain/types';
import type { ProjectsTranslator } from '@/i18n/compat-support';
import { ExternalLink } from '../../primitives/external-link';
import { ConditionalContent } from '../../primitives/conditional-content';

type ExperimentDetailBodyProps = {
  experiment: Experiment;
  t: ProjectsTranslator;
};

export function ExperimentDetailBody(props: ExperimentDetailBodyProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.experiment.href?.trim())}
        content={
          <Box visualVariant="experimentSource">
            <ExternalLink
              href={props.experiment.href ?? '#'}
              underline="none"
              visualVariant="experimentSource"
            >
              {props.t('source')}
            </ExternalLink>
          </Box>
        }
      />
      <ConditionalContent
        condition={Boolean(props.experiment.body)}
        content={
          <Box visualVariant="experimentBody">
            <ContentRichText content={props.experiment.body ?? {}} />
          </Box>
        }
      />
    </>
  );
}
