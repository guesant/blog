import { Typography } from '../../../ui';

type HomeExperienceCopyProps = {
  children: string;
};

export function HomeExperienceCopy(props: HomeExperienceCopyProps) {
  return (
    <Typography color="text.secondary" sx={{ mt: 1.25, maxWidth: '72ch' }}>
      {props.children}
    </Typography>
  );
}
