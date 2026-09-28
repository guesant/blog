import { ContentRichText } from '../../content/content-rich-text';
import type { Experiment } from '@portfolio/data/domain/types';
import type { ProjectsTranslator } from '@/i18n/compat-support';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ExperimentBodyFrame } from '../../ui/semantic/ExperimentBodyFrame';
import { ExperimentSourceFrame } from '../../ui/semantic/ExperimentSourceFrame';
import { ExperimentSourceLink } from '../../ui/semantic/ExperimentSourceLink';

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
          <ExperimentSourceFrame>
            <ExperimentSourceLink href={props.experiment.href ?? '#'} underline="none">
              {props.t('source')}
            </ExperimentSourceLink>
          </ExperimentSourceFrame>
        }
      />
      <ConditionalContent
        condition={Boolean(props.experiment.body)}
        content={
          <ExperimentBodyFrame>
            <ContentRichText content={props.experiment.body ?? {}} />
          </ExperimentBodyFrame>
        }
      />
    </>
  );
}
