import type { ReactNode } from 'react';
import { Icon } from '../../primitives/icon';
import { Box } from '../box';

type ContentDateLabelProps = {
  children: ReactNode;
};

export function ContentDateLabel(props: ContentDateLabelProps) {
  return (
    <Box component="span" sx={dateLabelStyles}>
      <Icon name="clock" size={12} />
      <span>{props.children}</span>
    </Box>
  );
}

const dateLabelStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2-5)',
  lineHeight: 'var(--site-leading-icon)',
};
