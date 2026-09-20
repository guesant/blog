import { Box } from '../../ui';
import { ContentRichText } from '../../content/content-rich-text';
import type { Writing } from '@portfolio/data/domain/types';

type WritingBodyProps = { item: Writing };

export function WritingBody(props: WritingBodyProps) {
  return (
    <Box visualVariant="writingBody">
      <ContentRichText content={props.item.body} />
    </Box>
  );
}
