import { Box, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { SourcePreviewData } from './types';

type SourcePreviewListItemTextProps = {
  data: SourcePreviewData;
};

export function SourcePreviewListItemText(props: SourcePreviewListItemTextProps) {
  return (
    <Box>
      <Typography component="p" visualVariant="sourcePreviewTitleFeed">
        {props.data.title}
      </Typography>
      <ConditionalContent condition={Boolean(props.data.description)}>
        <Typography visualVariant="sourcePreviewDescriptionFeed">
          {props.data.description}
        </Typography>
      </ConditionalContent>
    </Box>
  );
}
