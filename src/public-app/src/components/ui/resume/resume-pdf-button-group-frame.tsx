import type { ReactNode } from 'react';
import { ButtonGroup } from '../button-group';

type ResumePdfButtonGroupFrameProps = { children: ReactNode };

const buttonGroupStyles = {
  '& .MuiButtonGroup-grouped': {
    borderColor: 'var(--site-primary)',
    borderWidth: 'var(--site-border-width)',
  },
  '& .MuiButtonGroup-grouped:not(:last-of-type)': {
    borderRightColor: 'var(--site-primary)',
  },
  '& .MuiButtonGroup-grouped:hover': {
    borderColor: 'var(--site-primary-hover)',
  },
};

export function ResumePdfButtonGroupFrame(props: ResumePdfButtonGroupFrameProps) {
  return (
    <ButtonGroup variant="outlined" size="small" sx={buttonGroupStyles}>
      {props.children}
    </ButtonGroup>
  );
}
