import type { SiteText } from '@portfolio/data/domain/types';

type HomeSectionContact = {
  hasEmail: boolean;
  showContact: boolean;
};

export function homeSectionContact(site: SiteText): HomeSectionContact {
  const hasEmail = site.contact.hasEmail;

  return {
    hasEmail,
    showContact: site.contact.available && (hasEmail || site.contact.profiles.length > 0),
  };
}
