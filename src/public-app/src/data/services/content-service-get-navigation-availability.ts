import { getLocalizedSiteText } from '../api/public-site-source.ts';
import type { NavigationAvailability } from '../domain/types.ts';
import { getCases } from './content-service-get-cases';
import { getProjects } from './content-service-get-projects';
import { getExperiments } from './content-service-get-experiments';
import { getLatestNotes } from './content-service-get-latest-notes';
import { getReferences } from './content-service-get-references';

export async function getNavigationAvailability(locale?: string): Promise<NavigationAvailability> {
  const [cases, projects, experiments, writings, references] = await Promise.all([
    getCases(locale),
    getProjects(locale),
    getExperiments(locale),
    getLatestNotes(locale),
    getReferences(locale),
  ]);

  const site = await getLocalizedSiteText(locale);

  return {
    cases: cases.length > 0,
    projects: projects.length > 0 || experiments.length > 0,
    writing: writings.length > 0,
    achados: references.length > 0,
    contact: Boolean(
      site.contact.available && (site.contact.hasEmail || site.contact.profiles.length > 0),
    ),
  };
}
