import { getSiteText } from '@portfolio/content/server';
import type { MetadataRoute } from 'next';
import { siteUrl } from '../content/seo';

const aiTrainingCrawlers = [
  'GPTBot',
  'ChatGPT-User',
  'CCBot',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-Web',
  'Bytespider',
  'Applebot-Extended',
  'Amazonbot',
  'Meta-ExternalAgent',
  'Diffbot',
  'PerplexityBot',
];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSiteText('en');

  if (site.maintenanceEnabled || site.seo?.noIndex) {
    return {
      rules: { userAgent: '*', disallow: '/' },
      host: siteUrl.origin,
    };
  }

  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: aiTrainingCrawlers, disallow: '/' },
    ],
    sitemap: new URL('/sitemap.xml', siteUrl).toString(),
    host: siteUrl.origin,
  };
}
