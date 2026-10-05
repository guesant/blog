import { Typography } from '../../ui';
import { FollowSectionTitleText } from '../../ui/semantic/FollowSectionTitleText';
import { FollowSectionFrame } from '../../ui/semantic/FollowSectionFrame';

type FollowCurrentSectionProps = {
  label: string;
  title: string;
};

export function FollowCurrentSection(props: FollowCurrentSectionProps) {
  return (
    <FollowSectionFrame component="section">
      <Typography variant="overline" color="text.secondary">
        {props.label}
      </Typography>
      <FollowSectionTitleText component="h2" variant="h2">
        {props.title}
      </FollowSectionTitleText>
    </FollowSectionFrame>
  );
}
