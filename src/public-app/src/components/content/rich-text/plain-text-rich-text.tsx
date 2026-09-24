import { Box } from '../../ui';
import { PlainTextParagraph } from './plain-text-paragraph';

type PlainTextRichTextProps = {
  content: string;
};

export function PlainTextRichText(props: PlainTextRichTextProps) {
  const paragraphs = props.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <Box visualVariant="richTextPlain">
      {paragraphs.map((paragraph, index) => (
        <PlainTextParagraph key={`${paragraph}-${index}`} text={paragraph} />
      ))}
    </Box>
  );
}
