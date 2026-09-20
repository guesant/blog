import { RichTextElement } from '../../ui';
import { safeUrl, type RichTextNodeProps } from './types';

type RichTextImageProps = RichTextNodeProps;

export function RichTextImage(props: RichTextImageProps) {
  const { node } = props;

  const src = safeUrl(node.url);

  if (!src) {
    return null;
  }
  // biome-ignore lint/performance/noImgElement: CMS images are arbitrary remote URLs
  return <RichTextElement component="img" src={src} alt={node.alt ?? node.caption ?? ''} />;
}
