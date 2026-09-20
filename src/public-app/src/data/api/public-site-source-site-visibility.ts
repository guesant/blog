import type { SiteVisibility } from '../domain/types.ts';
import { RecordValue } from './public-site-source-support';

export function siteVisibility(value: RecordValue): SiteVisibility {
  return {
    about: value.about === true,
    resume: value.resume === true,
    portfolio: value.portfolio === true,
    cases: value.cases === true,
    contact: value.contact === true,
    license: value.license === true,
    credits: value.credits === true,
    follow: value.follow === true,
    feed: value.feed === true,
    writing: value.writing === true,
    findings: value.findings === true,
    topics: value.topics === true,
    collections: value.collections === true,
    snippets: value.snippets === true,
    rightSidebar: value.right_sidebar === true,
  };
}
