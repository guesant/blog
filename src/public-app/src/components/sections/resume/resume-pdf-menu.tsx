import { Menu } from '../../ui';
import { routing } from '../../../i18n/routing';
import type { ResumePdfActionsProps } from './types';
import { ResumePdfLocaleItems } from './resume-pdf-locale-items';

type ResumePdfMenuProps = ResumePdfActionsProps & {
  anchorEl: HTMLElement | null;
  onClose: () => void;
};

export function ResumePdfMenu(props: ResumePdfMenuProps) {
  return (
    <Menu anchorEl={props.anchorEl} open={Boolean(props.anchorEl)} onClose={props.onClose}>
      {routing.locales.map((locale) => (
        <ResumePdfLocaleItems
          key={locale}
          locale={locale}
          href={props.pdfUrls[locale]}
          t={props.t}
          onClose={props.onClose}
        />
      ))}
    </Menu>
  );
}
