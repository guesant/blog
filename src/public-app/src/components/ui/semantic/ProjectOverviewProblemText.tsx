import type { ComponentProps } from 'react';
import { Typography } from '../typography';

type ProjectOverviewProblemTextProps = ComponentProps<typeof Typography>;

export function ProjectOverviewProblemText(props: ProjectOverviewProblemTextProps) {
  return <Typography {...props} sx={{ mt: 1, ...props.sx }} />;
}
