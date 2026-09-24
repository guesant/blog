import { Typography } from '../../../ui';

type HomeExperienceCopyProps = {
  children: string;
};

export function HomeExperienceCopy(props: HomeExperienceCopyProps) {
  return (
    <Typography
      color="text.secondary"
      sx={{
        mt: 1.25,
        maxWidth: 'var(--site-lede-max)',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
      }}
    >
      {props.children}
    </Typography>
  );
}
