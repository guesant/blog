import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { Box } from '../box';
import { BreadcrumbTrailItemText } from './BreadcrumbTrailItemText';

type BreadcrumbCurrentItemContentProps = {
  label: string;
  leadingIcon?: ReactNode;
};

export function BreadcrumbCurrentItemContent(props: BreadcrumbCurrentItemContentProps) {
  return (
    <BreadcrumbTrailItemText
      variant="body2"
      color="text.primary"
      aria-current="page"
      sx={props.leadingIcon ? breadcrumbWithIconStyles : undefined}
    >
      <ConditionalContent
        condition={Boolean(props.leadingIcon)}
        content={
          <Box component="span" sx={breadcrumbIconStyles}>
            {props.leadingIcon}
          </Box>
        }
      />
      {props.label}
    </BreadcrumbTrailItemText>
  );
}

const breadcrumbWithIconStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-gap-cluster)',
  minWidth: 0,
};

const breadcrumbIconStyles = {
  display: 'inline-flex',
  flexShrink: 0,
};
