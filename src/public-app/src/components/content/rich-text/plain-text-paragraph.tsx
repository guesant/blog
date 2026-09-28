import { RichTextPlainParagraphText } from '../../ui/semantic/RichTextPlainParagraphText';

type PlainTextParagraphProps = {
  text: string;
};

export function PlainTextParagraph(props: PlainTextParagraphProps) {
  return <RichTextPlainParagraphText component="p">{props.text}</RichTextPlainParagraphText>;
}
