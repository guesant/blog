import { Button, ButtonGroup } from '../../ui';
import type { MouseEvent } from 'react';
import type { ResumePdfActionsProps } from './types';
import { ResumePdfOptionsButton } from './resume-pdf-options-button';

type ResumePdfButtonGroupProps = ResumePdfActionsProps & {
  open: boolean;
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function ResumePdfButtonGroup(props: ResumePdfButtonGroupProps) {
  return (
    <ButtonGroup variant="outlined" size="small">
      <Button
        component="a"
        href={props.pdfUrls[props.locale]}
        target="_blank"
        rel="noopener noreferrer"
        siteVariant="action"
      >
        {props.t('viewPdf')}
      </Button>
      <ResumePdfOptionsButton
        open={props.open}
        label={props.t('pdfOptions')}
        onClick={props.onOpen}
      />
    </ButtonGroup>
  );
}
