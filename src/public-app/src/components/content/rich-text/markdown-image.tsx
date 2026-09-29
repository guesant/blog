import { ConditionalContent } from '../../primitives/conditional-content';
import { RichTextElement } from '../../ui';
import { safeUrl } from './types';

export type MarkdownImageProps = {
  alt?: string;
  src?: string;
  title?: string;
};

export function MarkdownImage(props: MarkdownImageProps) {
  const src = safeUrl(props.src);

  return (
    <ConditionalContent
      condition={Boolean(src)}
      content={
        // biome-ignore lint/performance/noImgElement: Markdown images can come from the public CMS.
        <RichTextElement component="img" src={src} alt={props.alt ?? ''} title={props.title} />
      }
    />
  );
}
