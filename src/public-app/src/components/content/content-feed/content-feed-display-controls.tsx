'use client';

import { Icon } from '../../primitives/icon';
import { ConditionalContent } from '../../primitives/conditional-content';
import { ToggleButton } from '../../ui';
import { FeedSelectControl } from './feed-select-control';
import { buildContentFeedPerPageSelect } from './build-content-feed-per-page-select';
import { handleFeedDisplayModeChange } from './handle-feed-display-mode-change';
import type { ContentFeedDisplayMode } from './types';
import { ContentFeedDisplayControlsStack } from '../../ui/semantic/ContentFeedDisplayControlsStack';
import { ContentFeedDisplayModeToggleGroup } from '../../ui/semantic/ContentFeedDisplayModeToggleGroup';

type ContentFeedDisplayControlsProps = {
  displayMode: ContentFeedDisplayMode;
  perPage: number;
  modeLabel: string;
  paginationLabel: string;
  infiniteLabel: string;
  perPageLabel: string;
  onDisplayModeChange: (value: ContentFeedDisplayMode) => void;
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
      <ContentFeedDisplayModeToggleGroup
        exclusive
        value={props.displayMode}
        aria-label={props.modeLabel}
        onChange={handleFeedDisplayModeChange.bind(null, props.onDisplayModeChange)}
      >
        <ToggleButton value="pagination">
          <Icon name="list" size={16} />
          {props.paginationLabel}
        </ToggleButton>
        <ToggleButton value="infinite">
          <Icon name="infinity" size={16} />
          {props.infiniteLabel}
        </ToggleButton>
      </ContentFeedDisplayModeToggleGroup>
      <ConditionalContent
        condition={props.displayMode === 'pagination'}
        content={<FeedSelectControl {...perPageSelect} clearLabel={props.perPageLabel} />}
      />
    </ContentFeedDisplayControlsStack>
  );
}
