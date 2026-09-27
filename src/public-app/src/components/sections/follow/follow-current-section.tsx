import { Typography } from '../../ui';

type FollowCurrentSectionProps = {
  label: string;
  title: string;
};

export function FollowCurrentSection(props: FollowCurrentSectionProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.label}
      </Typography>
      <Typography component="h2" variant="h2" visualVariant="followSectionTitle">
        {props.title}
      </Typography>
    </>
  );
}
