import { getProfile, getSiteText } from '@portfolio/content/server';
import type { MetadataRoute } from 'next';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [profile, site] = await Promise.all([getProfile('en'), getSiteText('en')]);
  return {
    name: `${profile.name} — ${profile.title}`,
    short_name: profile.name,
    description: site.seo?.description || profile.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#F7F9FC',
    theme_color: '#173A63',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
