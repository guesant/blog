import { ProtectedEmail } from '../../contact/protected-email';
import { ConditionalContent } from '../../primitives/conditional-content';
import { SidebarLink } from './sidebar-link';
import { SidebarSection } from './sidebar-section';
import { RightSidebarContactProfiles } from './right-sidebar-contact-profiles';
import type { SiteText } from '@portfolio/data/domain/types';
import type { SidebarTranslator } from '@/i18n/compat-support';

type RightSidebarContactSectionProps = {
  showContact: boolean;
  site: SiteText;
  pathname: string;
  locale: string;
  onNavigate?: () => void;
  t: SidebarTranslator;
};

export function RightSidebarContactSection(props: RightSidebarContactSectionProps) {
  return (
    <ConditionalContent
      condition={props.showContact}
      content={
        <SidebarSection label={props.t('connect')}>
          <SidebarLink
            item={{ route: '/contact', label: props.t('contact'), children: [] }}
            pathname={props.pathname}
            locale={props.locale}
            onNavigate={props.onNavigate}
          />
          <RightSidebarContactProfiles site={props.site} />
          <ConditionalContent
            condition={props.site.contact.hasEmail}
            content={
              <ProtectedEmail
                challenge={props.site.contact.emailChallenge}
                available={props.site.contact.hasEmail}
                label={props.t('contact')}
                variant="sidebar"
              />
            }
          />
        </SidebarSection>
      }
    />
  );
}
