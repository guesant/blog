import { Box } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { SourcePreviewData } from './types';
import { SourcePreviewDescriptionFeedText } from '../../ui/semantic/SourcePreviewDescriptionFeedText';
import { SourcePreviewTitleFeedText } from '../../ui/semantic/SourcePreviewTitleFeedText';
import { SourcePreviewTitleLink } from '../../ui/semantic/SourcePreviewTitleLink';

type SourcePreviewListItemTextProps = {
  data: SourcePreviewData;
};

export function SourcePreviewListItemText(props: SourcePreviewListItemTextProps) {
  return (
    <Box>
      <SourcePreviewTitleFeedText component="p">
        <SourcePreviewTitleLink href={props.data.url} iconSize={14}>
          {props.data.title}
        </SourcePreviewTitleLink>
      </SourcePreviewTitleFeedText>
      <ConditionalContent condition={Boolean(props.data.description)}>
        <SourcePreviewDescriptionFeedText>
          {props.data.description}
        </SourcePreviewDescriptionFeedText>
      </ConditionalContent>
    </Box>
  );
}
