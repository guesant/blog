import MuiBox from '@mui/material/Box';
import { forwardRef } from 'react';

type VisibilitySentinelProps = {
  'aria-label'?: string;
};

export const VisibilitySentinel = forwardRef<HTMLSpanElement, VisibilitySentinelProps>(
  function VisibilitySentinel(props, ref) {
    return (
      <MuiBox
        component="span"
        ref={ref}
        aria-hidden={props['aria-label'] ? undefined : true}
        aria-label={props['aria-label']}
        sx={{ display: 'block', height: 'var(--site-space-1)', width: '100%' }}
      />
    );
  },
);
