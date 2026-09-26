import { ListSubheader, MenuItem } from '../../ui';
import type { ResumeTranslator } from '@/i18n/compat-support';
import { pdfLocaleLabels } from './types';

type ResumePdfLocaleItemsProps = {
  locale: string;
  href: string;
  t: ResumeTranslator;
  onClose: () => void;
};

export function ResumePdfLocaleItems(props: ResumePdfLocaleItemsProps) {
  return (
    <>
      <ListSubheader disableSticky>{pdfLocaleLabels[props.locale] ?? props.locale}</ListSubheader>
      <MenuItem
        component="a"
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={props.onClose}
      >
        {props.t('viewPdf')}
      </MenuItem>
      <MenuItem component="a" href={props.href} download onClick={props.onClose}>
        {props.t('downloadPdf')}
      </MenuItem>
    </>
  );
}
