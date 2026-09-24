import { Typography } from '../../ui';

type PlainTextParagraphProps = {
  text: string;
};

export function PlainTextParagraph(props: PlainTextParagraphProps) {
  return (
    <Typography component="p" visualVariant="richTextPlainParagraph">
      {props.text}
    </Typography>
  );
}
