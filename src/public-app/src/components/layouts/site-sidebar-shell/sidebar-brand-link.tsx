import { SidebarBrandLinkFrame } from '../../ui';
import { Link as LocaleLink } from '../../../i18n/navigation';

export function SidebarBrandLink() {
  return (
    <SidebarBrandLinkFrame component={LocaleLink} href="/">
      guesant.net
    </SidebarBrandLinkFrame>
  );
}
