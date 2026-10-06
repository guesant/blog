import { Typography } from '../typography';
import { editorialPageTitleStyles } from '../editorial-typography';

type PageHeaderTitleProps = {
  inlineAdornment?: boolean;
  title: string;
};

export function PageHeaderTitle(props: PageHeaderTitleProps) {
  return (
    <Typography
      variant="h1"
      sx={{
        ...editorialPageTitleStyles,
        ...(props.inlineAdornment ? { display: 'inline', width: 'auto' } : {}),
      }}
    >
      {props.title}
    </Typography>
  );
}
