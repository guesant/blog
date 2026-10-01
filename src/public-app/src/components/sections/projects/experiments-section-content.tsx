import { CollectionListing } from '../../content/collection-listing';
import type { ExperimentsSectionProps } from './types';
import { ExperimentRow } from './experiment-row';
import { ExperimentsSectionTitleText } from '../../ui/semantic/ExperimentsSectionTitleText';
import { ExperimentsSectionText } from '../../ui/semantic/ExperimentsSectionText';

type ExperimentsSectionContentProps = ExperimentsSectionProps;

export function ExperimentsSectionContent(props: ExperimentsSectionContentProps) {
  return (
    <>
      <ExperimentsSectionText id="experiments" variant="overline" color="text.secondary">
        {props.page.archiveLabel}
      </ExperimentsSectionText>
      <ExperimentsSectionTitleText component="h2" variant="h5">
        {props.page.experimentsTitle}
      </ExperimentsSectionTitleText>
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
