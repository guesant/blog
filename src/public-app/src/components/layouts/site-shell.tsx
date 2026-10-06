import type { NavigationAvailability, Profile, SiteText } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { SiteShellFrame } from './site-shell-frame';
import { SiteFeatureFlagsProvider } from '../content/site-feature-flags-provider';
import { SiteNavigationProvider } from '../content/site-navigation-provider';
import { SkipToContentLinkFrame } from '../ui/semantic/SkipToContentLinkFrame';
import { SiteApplicationRootFrame } from '../ui/semantic/SiteApplicationRootFrame';

type SiteShellProps = {
  children: React.ReactNode;
  profile: Profile;
  site: SiteText;
  availability: NavigationAvailability;
};

export function SiteShell(props: SiteShellProps) {
  const { children, profile, site, availability } = props;

  const t = useTranslations('Nav');

  return (
    <SiteApplicationRootFrame>
      <SkipToContentLinkFrame component="a" href="#main-content">
        {t('skipToContent')}
      </SkipToContentLinkFrame>
      <SiteFeatureFlagsProvider value={site.featureFlags}>
        <SiteNavigationProvider value={site.navigation} visibility={site.visibility}>
          <SiteShellFrame profile={profile} site={site} availability={availability}>
            {children}
          </SiteShellFrame>
        </SiteNavigationProvider>
      </SiteFeatureFlagsProvider>
    </SiteApplicationRootFrame>
  );
}
