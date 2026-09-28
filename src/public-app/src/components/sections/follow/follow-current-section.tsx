import { Typography } from '../../ui';
import { FollowSectionTitleText } from '../../ui/semantic/FollowSectionTitleText';

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
      <FollowSectionTitleText component="h2" variant="h2">
        {props.title}
      </FollowSectionTitleText>
    </>
  );
}
