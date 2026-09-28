import { CollectionListing } from '../../content/collection-listing';
import type { ExperimentsSectionProps } from './types';
import { ExperimentRow } from './experiment-row';
import { ExperimentsSection2Text } from '../../ui/semantic/ExperimentsSection2Text';
import { ExperimentsSectionText } from '../../ui/semantic/ExperimentsSectionText';

type ExperimentsSectionContentProps = ExperimentsSectionProps;

export function ExperimentsSectionContent(props: ExperimentsSectionContentProps) {
  return (
    <>
      <ExperimentsSectionText id="experiments" variant="overline" color="text.secondary">
        {props.page.archiveLabel}
      </ExperimentsSectionText>
      <ExperimentsSection2Text component="h2" variant="h5">
        {props.page.experimentsTitle}
      </ExperimentsSection2Text>
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
