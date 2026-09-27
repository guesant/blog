import type { SiteText } from '@portfolio/data/domain/types';

type HomeSectionContact = {
  hasEmail: boolean;
  showContact: boolean;
  showAvailability: boolean;
};

export function homeSectionContact(site: SiteText): HomeSectionContact {
  const hasEmail = site.contact.hasEmail;

  return {
    hasEmail,
    showContact: site.contact.enabled && (hasEmail || site.contact.profiles.length > 0),
    showAvailability: site.contact.enabled && site.contact.available,
  };
}
