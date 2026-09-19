import type { ProfileReadmeSource } from './content.ts';

const profilePlatforms = ['linkedin', 'github', 'lattes', 'orcid', 'instagram', 'gitlab'] as const;

const profilePlatformLabels: Record<(typeof profilePlatforms)[number], string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  lattes: 'Lattes',
  orcid: 'ORCID',
  instagram: 'Instagram',
  gitlab: 'GitLab',
};

function text(value: string | undefined): string | undefined {
  const normalized = value?.trim();
  return normalized || undefined;
}

function escapeMarkdownText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\\`*_{}[\]#>|]/g, '\\$&');
}

function safeExternalUrl(value: string | undefined): string | undefined {
  const normalized = text(value);
  if (!normalized) {
    return undefined;
  }

  try {
    const url = new URL(normalized);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return undefined;
    }
    return url
      .toString()
      .replaceAll('(', '%28')
      .replaceAll(')', '%29')
      .replaceAll('[', '%5B')
      .replaceAll(']', '%5D');
  } catch {
    return undefined;
  }
}

function safeEmail(value: string | undefined): string | undefined {
  const normalized = text(value);
  return normalized && !/\s/.test(normalized) && normalized.includes('@') ? normalized : undefined;
}

function markdownLink(label: string, url: string): string {
  return `[${escapeMarkdownText(label)}](${url})`;
}

function section(heading: string, content: string[]): string | undefined {
  const visibleContent = content.filter((item) => item.trim());
  return visibleContent.length > 0 ? [`## ${heading}`, ...visibleContent].join('\n\n') : undefined;
}

function languageProficiency(proficiency: string | undefined): string | undefined {
  if (!proficiency) {
    return undefined;
  }
  return proficiency === 'native' ? 'Native' : proficiency;
}

function profileContacts(source: ProfileReadmeSource): string | undefined {
  if (!source.site.contact.available) {
    return undefined;
  }

  const contacts: string[] = [];
  const email = safeEmail(source.email);
  if (email) {
    contacts.push(`- ${markdownLink(email, `mailto:${encodeURIComponent(email)}`)}`);
  }

  for (const platform of profilePlatforms) {
    const profile = source.site.contact.profiles.find((item) => item.platform === platform);
    const url = safeExternalUrl(profile?.url);
    if (url) {
      contacts.push(`- ${markdownLink(profilePlatformLabels[platform], url)}`);
    }
  }

  return section('Social', [contacts.join('\n')]);
}

function introductionSection(source: ProfileReadmeSource): string {
  const { profile, resume } = source;
  const name = text(profile.name) ?? 'Hello';
  const introduction = [`# Hello, my name is ${escapeMarkdownText(name)} 👋`];
  const title = text(profile.title);
  const description = text(profile.description);
  const summary = text(resume.summary);
  if (title) {
    introduction.push(`**${escapeMarkdownText(title)}**`);
  }
  if (description) {
    introduction.push(escapeMarkdownText(description));
  }
  if (summary) {
    introduction.push(escapeMarkdownText(summary));
  }
  return introduction.join('\n\n');
}

function plainTextSection(heading: string, value: string | undefined): string | undefined {
  return value ? section(heading, [escapeMarkdownText(value)]) : undefined;
}

function interestsSection(source: ProfileReadmeSource): string | undefined {
  const interests: string[] = [];
  const technicalInterests = text(source.profile.interests);
  const learning = text(source.profile.learning);
  if (technicalInterests) {
    interests.push(`**Technical interests:** ${escapeMarkdownText(technicalInterests)}`);
  }
  if (learning) {
    interests.push(`**Learning:** ${escapeMarkdownText(learning)}`);
  }
  return section('Interests', interests);
}

function hobbiesSection(source: ProfileReadmeSource): string | undefined {
  const interests = source.profile.personalInterests
    .map(text)
    .filter((interest): interest is string => Boolean(interest))
    .map((interest) => `- ${escapeMarkdownText(interest)}`);
  return section('Hobbies', [interests.join('\n')]);
}

function languagesSection(source: ProfileReadmeSource): string | undefined {
  const languages = source.resume.languages
    .map((language) => {
      const languageName = text(language.name);
      if (!languageName) {
        return undefined;
      }
      const proficiency = languageProficiency(language.proficiency);
      return `- ${escapeMarkdownText(languageName)}${proficiency ? ` — ${proficiency}` : ''}`;
    })
    .filter((language): language is string => Boolean(language));
  return section('Languages', [languages.join('\n')]);
}

function stacksSection(source: ProfileReadmeSource): string | undefined {
  const stacks = source.resume.skills
    .map((group) => {
      const label = text(group.label);
      const items = group.items
        .map(text)
        .filter((item): item is string => Boolean(item))
        .map(escapeMarkdownText);
      return label && items.length > 0
        ? `### ${escapeMarkdownText(label)}\n\n${items.join(' · ')}`
        : undefined;
    })
    .filter((group): group is string => Boolean(group));
  return section('Stacks', stacks);
}

function portfolioSection(source: ProfileReadmeSource): string | undefined {
  const url = safeExternalUrl(source.site.portfolioUrl);
  return url ? section('Portfolio', [markdownLink('Visit my portfolio', url)]) : undefined;
}

export function renderProfileReadme(source: ProfileReadmeSource): string {
  const sections = [
    introductionSection(source),
    plainTextSection('Location', text(source.profile.location)),
    plainTextSection(
      'Born in',
      text(source.profile.birthCity) ? `${text(source.profile.birthCity)} 🇧🇷` : undefined,
    ),
    interestsSection(source),
    hobbiesSection(source),
    languagesSection(source),
    stacksSection(source),
    profileContacts(source),
    portfolioSection(source),
  ].filter((item): item is string => Boolean(item));

  return `${[
    '<!-- Generated by guesant/portfolio. Do not edit this file manually. -->',
    ...sections,
  ].join('\n\n')}\n`;
}
