import { FeedSelectControl } from './feed-select-control';
import { buildContentFeedPerPageSelect } from './build-content-feed-per-page-select';
import { ContentFeedDisplayControlsStack } from '../../ui/semantic/ContentFeedDisplayControlsStack';

type ContentFeedDisplayControlsProps = {
  perPage: number;
  perPageLabel: string;
  onPerPageChange: (value: number) => void;
};

export function ContentFeedDisplayControls(props: ContentFeedDisplayControlsProps) {
  const perPageSelect = buildContentFeedPerPageSelect({
    value: props.perPage,
    label: props.perPageLabel,
    onChange: props.onPerPageChange,
  });

  return (
    <ContentFeedDisplayControlsStack direction="row">
      <FeedSelectControl {...perPageSelect} clearLabel={props.perPageLabel} />
    </ContentFeedDisplayControlsStack>
  );
}
