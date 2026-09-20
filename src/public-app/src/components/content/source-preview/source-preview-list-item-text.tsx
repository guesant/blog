import { Box, Typography } from '../../ui';
import { ConditionalContent } from '../../primitives/conditional-content';
import type { SourcePreviewData } from './types';
import type { SourcePreviewVariant } from './source-preview-variant';
import { sourcePreviewVariantNames } from './source-preview-variant';

type SourcePreviewListItemTextProps = {
  data: SourcePreviewData;
  variant: SourcePreviewVariant;
};

export function SourcePreviewListItemText(props: SourcePreviewListItemTextProps) {
  const isDetail = props.variant === 'detail';

  return (
    <Box visualVariant={`sourcePreviewText${sourcePreviewVariantNames[props.variant]}`}>
      <Typography
        component={isDetail ? 'h3' : 'p'}
        visualVariant={isDetail ? 'sourcePreviewTitleDetail' : 'sourcePreviewTitleFeed'}
      >
        {props.data.title}
      </Typography>
      <ConditionalContent condition={Boolean(props.data.description)}>
        <Typography
          visualVariant={
            isDetail ? 'sourcePreviewDescriptionDetail' : 'sourcePreviewDescriptionFeed'
          }
        >
          {props.data.description}
        </Typography>
      </ConditionalContent>
    </Box>
  );
}
