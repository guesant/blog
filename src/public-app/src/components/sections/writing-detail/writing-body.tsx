import { ContentRichText } from '../../content/content-rich-text';
import type { Writing } from '@portfolio/data/domain/types';
import { WritingBodyFrame } from '../../ui/semantic/WritingBodyFrame';

type WritingBodyProps = { item: Writing };

export function WritingBody(props: WritingBodyProps) {
  return (
    <WritingBodyFrame>
      <ContentRichText content={props.item.body} />
    </WritingBodyFrame>
  );
}
