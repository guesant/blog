import { Divider, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { ExplorationSectionProps } from './types';

type ExplorationSectionHeaderProps = Pick<
  ExplorationSectionProps,
  'eyebrow' | 'title' | 'description' | 'divider'
>;

export function ExplorationSectionHeader(props: ExplorationSectionHeaderProps) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(props.divider)}
        content={<Divider visualVariant="explorationSection" />}
      />
      <ConditionalContent
        condition={Boolean(props.eyebrow)}
        content={
          <Typography variant="overline" color="text.secondary">
            {props.eyebrow}
          </Typography>
        }
      />
      <Typography
        component="h2"
        variant="h2"
        visualVariant={props.divider ? undefined : 'explorationTitle'}
      >
        {props.title}
      </Typography>
      <ConditionalContent
        condition={Boolean(props.description)}
        content={
          <Typography color="text.secondary" visualVariant="explorationSection">
            {props.description}
          </Typography>
        }
      />
    </>
  );
}
