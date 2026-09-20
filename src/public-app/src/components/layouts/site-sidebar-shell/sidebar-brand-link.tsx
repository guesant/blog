import { Link } from '../../ui';
import { Link as LocaleLink } from '../../../i18n/navigation';

export function SidebarBrandLink() {
  return (
    <Link component={LocaleLink} href="/" visualVariant="siteBrand">
      guesant.net
    </Link>
  );
}
