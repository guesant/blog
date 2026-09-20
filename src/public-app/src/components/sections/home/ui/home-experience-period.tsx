import { Typography } from '../../../ui';

type HomeExperiencePeriodProps = {
  children: string;
};

export function HomeExperiencePeriod(props: HomeExperiencePeriodProps) {
  return (
    <Typography color="text.secondary" sx={{ fontSize: '.8125rem', pt: 0.35 }}>
      {props.children}
    </Typography>
  );
}
