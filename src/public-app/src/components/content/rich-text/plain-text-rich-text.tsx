import { PlainTextParagraph } from './plain-text-paragraph';
import { RichTextPlainFrame } from '../../ui/semantic/RichTextPlainFrame';

type PlainTextRichTextProps = {
  content: string;
};

export function PlainTextRichText(props: PlainTextRichTextProps) {
  const paragraphs = props.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <RichTextPlainFrame>
      {paragraphs.map((paragraph, index) => (
        <PlainTextParagraph key={`${paragraph}-${index}`} text={paragraph} />
      ))}
    </RichTextPlainFrame>
  );
}
