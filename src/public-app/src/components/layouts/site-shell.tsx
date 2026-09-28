import type { NavigationAvailability, Profile, SiteText } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { SiteShellFrame } from './site-shell-frame';
import { SiteFeatureFlagsProvider } from '../content/site-feature-flags-provider';
import { SiteShell2Frame } from '../ui/semantic/SiteShell2Frame';
import { SiteShellFrame2 } from '../ui/semantic/SiteShellFrame2';

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
    <SiteShellFrame2>
      <SiteShell2Frame component="a" href="#main-content">
        {t('skipToContent')}
      </SiteShell2Frame>
      <SiteFeatureFlagsProvider value={site.featureFlags}>
        <SiteShellFrame profile={profile} site={site} availability={availability}>
          {children}
        </SiteShellFrame>
      </SiteFeatureFlagsProvider>
    </SiteShellFrame2>
  );
}
