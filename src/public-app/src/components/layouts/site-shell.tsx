import { Box } from '../ui';
import type { NavigationAvailability, Profile, SiteText } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { SiteShellFrame } from './site-shell-frame';
import { SiteFeatureFlagsProvider } from '../content/site-feature-flags-provider';

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
    <Box visualVariant="siteShell">
      <Box component="a" href="#main-content" visualVariant="siteShell2">
        {t('skipToContent')}
      </Box>
      <SiteFeatureFlagsProvider value={site.featureFlags}>
        <SiteShellFrame profile={profile} site={site} availability={availability}>
          {children}
        </SiteShellFrame>
      </SiteFeatureFlagsProvider>
    </Box>
  );
}
