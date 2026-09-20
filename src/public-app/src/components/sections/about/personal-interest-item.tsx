'use client';

import { Box } from '../../ui';

type PersonalInterestItemProps = { interest: string };

export function PersonalInterestItem(props: PersonalInterestItemProps) {
  return <Box component="li">{props.interest}</Box>;
}
