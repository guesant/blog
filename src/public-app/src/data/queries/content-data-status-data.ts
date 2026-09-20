import { getSiteText } from '@portfolio/data/services';
import { RouteData } from './content-data-support';

export async function statusData(locale: string, status: 'notFound' | 'error'): Promise<RouteData> {
  const site = await getSiteText(locale);

  return {
    kind: 'status',
    status,
    sourceRepositoryUrl: site.sourceRepositoryUrl,
  };
}
