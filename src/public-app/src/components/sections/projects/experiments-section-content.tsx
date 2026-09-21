import { Typography } from '../../ui';
import { CollectionListing } from '../../content/collection-listing';
import type { ExperimentsSectionProps } from './types';
import { ExperimentRow } from './experiment-row';

type ExperimentsSectionContentProps = ExperimentsSectionProps;

export function ExperimentsSectionContent(props: ExperimentsSectionContentProps) {
  return (
    <>
      <Typography
        id="experiments"
        variant="overline"
        color="text.secondary"
        visualVariant="experimentsSection"
      >
        {props.page.archiveLabel}
      </Typography>
      <Typography component="h2" variant="h5" visualVariant="experimentsSection2">
        {props.page.experimentsTitle}
      </Typography>
      <CollectionListing
        items={props.experiments}
        getKey={(item) => item.slug}
        renderListItem={(item) => <ExperimentRow item={item} />}
        pagination={{
          meta: props.pagination,
          action: '/projects',
          pageParameter: 'experiments_page',
        }}
      />
    </>
  );
}
