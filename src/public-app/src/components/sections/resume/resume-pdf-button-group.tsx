import { ResumePdfButtonGroupFrame } from '../../ui';
import type { MouseEvent } from 'react';
import type { ResumePdfActionsProps } from './types';
import { ResumePdfOptionsButton } from './resume-pdf-options-button';
import { ActionButton } from '../../ui/semantic/ActionButton';

type ResumePdfButtonGroupProps = ResumePdfActionsProps & {
  open: boolean;
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function ResumePdfButtonGroup(props: ResumePdfButtonGroupProps) {
  return (
    <ResumePdfButtonGroupFrame>
      <ActionButton
        component="a"
        href={props.pdfUrls[props.locale]}
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.t('viewPdf')}
      </ActionButton>
      <ResumePdfOptionsButton
        open={props.open}
        label={props.t('pdfOptions')}
        onClick={props.onOpen}
      />
    </ResumePdfButtonGroupFrame>
  );
}
