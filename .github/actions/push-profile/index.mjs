import { appendFile, mkdir, rename, rm, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

const profilePlatforms = ['linkedin', 'github', 'lattes', 'orcid', 'instagram', 'gitlab'];

const profilePlatformLabels = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  lattes: 'Lattes',
  orcid: 'ORCID',
  instagram: 'Instagram',
  gitlab: 'GitLab',
};

function text(value) {
  const normalized = typeof value === 'string' ? value.trim() : '';
  return normalized || undefined;
}

function stringValue(value) {
  return typeof value === 'string' ? value : value == null ? '' : String(value);
}

function escapeMarkdownText(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/[\\`*_{}[\]#>|]/g, '\\$&');
}

function safeExternalUrl(value) {
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

function safeEmail(value) {
  const normalized = text(value);
  return normalized && !/\s/.test(normalized) && normalized.includes('@') ? normalized : undefined;
}

function markdownLink(label, url) {
  return `[${escapeMarkdownText(label)}](${url})`;
}

function section(heading, content) {
  const visibleContent = content.filter((item) => item.trim());
  return visibleContent.length > 0 ? [`## ${heading}`, ...visibleContent].join('\n\n') : undefined;
}

function languageProficiency(proficiency) {
  if (!proficiency) {
    return undefined;
  }
  return proficiency === 'native' ? 'Native' : proficiency;
}

function profileContacts(source) {
  if (!source.site.contact.available) {
    return undefined;
  }

  const contacts = [];
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

function introductionSection(source) {
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

function plainTextSection(heading, value) {
  return value ? section(heading, [escapeMarkdownText(value)]) : undefined;
}

function interestsSection(source) {
  const interests = [];
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

function hobbiesSection(source) {
  const interests = source.profile.personalInterests
    .map(text)
    .filter(Boolean)
    .map((interest) => `- ${escapeMarkdownText(interest)}`);
  return section('Hobbies', [interests.join('\n')]);
}

function languagesSection(source) {
  const languages = source.resume.languages
    .map((language) => {
      const languageName = text(language.name);
      if (!languageName) {
        return undefined;
      }
      const proficiency = languageProficiency(language.proficiency);
      return `- ${escapeMarkdownText(languageName)}${proficiency ? ` — ${proficiency}` : ''}`;
    })
    .filter(Boolean);
  return section('Languages', [languages.join('\n')]);
}

function stacksSection(source) {
  const stacks = source.resume.skills
    .map((group) => {
      const label = text(group.label);
      const items = group.items.map(text).filter(Boolean).map(escapeMarkdownText);
      return label && items.length > 0
        ? `### ${escapeMarkdownText(label)}\n\n${items.join(' · ')}`
        : undefined;
    })
    .filter(Boolean);
  return section('Stacks', stacks);
}

function portfolioSection(source) {
  const url = safeExternalUrl(source.site.portfolioUrl);
  return url ? section('Portfolio', [markdownLink('Visit my portfolio', url)]) : undefined;
}

export function renderProfileReadme(source) {
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
  ].filter(Boolean);

  return `${[
    '<!-- Generated by guesant/portfolio. Do not edit this file manually. -->',
    ...sections,
  ].join('\n\n')}\n`;
}

function arrayValue(value) {
  return Array.isArray(value) ? value : [];
}

function profileReadmeSource(snapshot, email) {
  const profile = snapshot.chrome?.profile ?? {};
  const site = snapshot.chrome?.site ?? {};
  const resume = snapshot.resume ?? {};

  return {
    profile: {
      name: stringValue(profile.name),
      title: stringValue(profile.title),
      location: stringValue(profile.location),
      birthCity: stringValue(profile.birth_city),
      description: stringValue(profile.description),
      interests: stringValue(profile.interests),
      learning: stringValue(profile.learning),
      personalInterests: arrayValue(profile.personal_interests).map(stringValue),
      trajectory: arrayValue(profile.trajectory),
      milestones: arrayValue(profile.milestones),
    },
    resume: {
      summary: stringValue(resume.summary),
      skills: arrayValue(resume.skills).map((skill) => ({
        label: stringValue(skill.name),
        items: arrayValue(skill.technologies).map((technology) =>
          stringValue(technology.name ?? technology.slug),
        ),
      })),
      languages: arrayValue(resume.languages).map((language) => ({
        code: stringValue(language.code),
        name: stringValue(language.name),
        proficiency: stringValue(language.proficiency),
      })),
      selectedCases: [],
      leadership: arrayValue(resume.leadership),
      education: arrayValue(resume.education),
      certificates: arrayValue(resume.certificates),
      certifications: arrayValue(resume.certifications),
      publications: arrayValue(resume.publications),
      recommendations: arrayValue(resume.recommendations),
      technicalProductions: arrayValue(resume.technical_productions),
      events: arrayValue(resume.events),
      awards: arrayValue(resume.awards),
    },
    site: {
      shortName: stringValue(site.short_name),
      portfolioUrl: stringValue(site.portfolio_url),
      copyrightTemplate: stringValue(snapshot.chrome?.copyright),
      maintenanceEnabled: site.maintenance_enabled === true,
      maintenance: {
        eyebrow: stringValue(site.maintenance_eyebrow),
        title: stringValue(site.maintenance_title),
        description: stringValue(site.maintenance_description),
      },
      contact: {
        available: site.contact_available === true,
        hasEmail: Boolean(safeEmail(email)),
        profiles: arrayValue(site.contact_profiles).map((profile) => ({
          platform: stringValue(profile.platform),
          url: stringValue(profile.url),
        })),
      },
    },
    email: stringValue(email),
  };
}

export async function loadProfileReadmeSource({ apiUrl, locale = 'en', token, email = '' }) {
  const url = new URL(apiUrl);
  url.searchParams.set('locale', locale);
  const headers = { accept: 'application/json' };
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Laravel API request failed with HTTP ${response.status}`);
  }

  return profileReadmeSource(await response.json(), email);
}

function workspaceOutputPath(output, workspace) {
  const workspacePath = path.resolve(workspace);
  const destination = path.resolve(workspacePath, output);
  const relative = path.relative(workspacePath, destination);
  if (
    !relative ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error('Output must be a file inside GITHUB_WORKSPACE');
  }
  return destination;
}

export async function writeFileAtomically(outputPath, content) {
  const destination = path.resolve(outputPath);
  const temporaryPath = path.join(
    path.dirname(destination),
    `.${path.basename(destination)}.${process.pid}.${randomUUID()}.tmp`,
  );

  try {
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(temporaryPath, content, 'utf8');
    await rename(temporaryPath, destination);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
}

export async function generateProfileReadme({ outputPath, workspace, source }) {
  const destination = workspaceOutputPath(outputPath, workspace);
  const readme = renderProfileReadme(source);
  await writeFileAtomically(destination, readme);
  return { destination, readme };
}

function input(name, fallback = '') {
  return process.env[`INPUT_${name.toUpperCase()}`]?.trim() || fallback;
}

async function run() {
  const apiUrl = input('api-url');
  if (!apiUrl) {
    throw new Error('The api-url input is required');
  }

  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
  const output = input('output', 'README.md');
  const source = await loadProfileReadmeSource({
    apiUrl,
    locale: input('locale', 'en'),
    token: input('api-token'),
    email: input('email'),
  });
  const result = await generateProfileReadme({ outputPath: output, workspace, source });
  const outputFile = process.env.GITHUB_OUTPUT;
  if (outputFile) {
    await appendFile(outputFile, `readme-path=${path.relative(workspace, result.destination)}\n`);
  }
  console.log(`Generated ${path.relative(workspace, result.destination)}`);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)
) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
