import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runRegenerationCli } from '../../content/src/regeneration.ts';
import { createContentRuntime } from '../../content/src/runtime.ts';
import type {
  CaseStudy,
  ExternalProfile,
  ResumeContent,
  SiteText,
} from '../../content/src/types.ts';

function optionValue(option: string) {
  const index = process.argv.indexOf(option);
  return index === -1 ? undefined : process.argv[index + 1];
}

const templatesDir = fileURLToPath(new URL('../templates/', import.meta.url));
const publicDir = path.resolve(process.cwd(), optionValue('--output-dir') ?? 'public');
const contentDir = path.resolve(
  process.cwd(),
  optionValue('--content-dir') ??
    fileURLToPath(new URL('../../content/content/cms/', import.meta.url)),
);
const contentRuntime = createContentRuntime(contentDir);

type LocaleCode = 'en' | 'pt-BR';

type Locale = {
  code: LocaleCode;
  templateFile: string;
  outputFile: string;
  experienceHeading: string;
  leadershipHeading: string;
  educationHeading: string;
  certificatesHeading: string;
  certificationsHeading: string;
  publicationsHeading: string;
  technicalProductionsHeading: string;
  eventsHeading: string;
  awardsHeading: string;
  languagesHeading: string;
  nativeProficiency: string;
};

type LocaleLanguageLabels = Pick<Locale, 'languagesHeading' | 'nativeProficiency'>;
type SkillGroup = { label: string; items: string[] };
type ResumeLanguage = { name: string; code: string; proficiency?: string };

const locales: Locale[] = [
  {
    code: 'en',
    templateFile: 'en.tex',
    outputFile: 'resume-en.pdf',
    experienceHeading: 'Experience',
    leadershipHeading: 'Leadership Activities',
    educationHeading: 'Education',
    certificatesHeading: 'Certificates',
    certificationsHeading: 'Certifications',
    publicationsHeading: 'Publications',
    technicalProductionsHeading: 'Technical Productions',
    eventsHeading: 'Events',
    awardsHeading: 'Awards',
    languagesHeading: 'Languages',
    nativeProficiency: 'Native',
  },
  {
    code: 'pt-BR',
    templateFile: 'pt-BR.tex',
    outputFile: 'resume-pt-BR.pdf',
    experienceHeading: 'Experiência',
    leadershipHeading: 'Atividades de Liderança',
    educationHeading: 'Educação',
    certificatesHeading: 'Certificados',
    certificationsHeading: 'Certificações',
    publicationsHeading: 'Publicações',
    technicalProductionsHeading: 'Produções Técnicas',
    eventsHeading: 'Eventos',
    awardsHeading: 'Prêmios',
    languagesHeading: 'Idiomas',
    nativeProficiency: 'Nativo',
  },
];

function selectedLocales(): Locale[] {
  const requestedLocale = optionValue('--locale');
  if (!requestedLocale) {
    return locales;
  }
  const selected = locales.find((locale) => locale.code === requestedLocale);
  if (!selected) {
    throw new Error(`Unsupported résumé locale: ${requestedLocale}`);
  }
  return [selected];
}

function escapeLatex(value: string): string {
  return value
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

type LeadershipItem = ResumeContent['leadership'][number];
type EducationItem = ResumeContent['education'][number];
type CredentialItem = ResumeContent['certificates'][number];
type PublicationItem = ResumeContent['publications'][number];
type TechnicalProductionItem = ResumeContent['technicalProductions'][number];
type EventItem = ResumeContent['events'][number];
type AwardItem = ResumeContent['awards'][number];

const platformLabels: Record<string, string> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  lattes: 'Lattes',
  orcid: 'ORCID',
  scholar: 'Google Scholar',
  researchgate: 'ResearchGate',
  mastodon: 'Mastodon',
  bluesky: 'Bluesky',
};

function profilePlatformLabel(profile: ExternalProfile): string {
  if (profile.label?.trim()) {
    return profile.label.trim();
  }
  return platformLabels[profile.platform] ?? stripProtocol(profile.url);
}

function buildContactLinks(site: SiteText, email: string): string {
  const links: string[] = [];
  if (email) {
    links.push(`\\href{mailto:${email}}{${escapeLatex(email)}}`);
  }
  for (const profile of site.contact.profiles ?? []) {
    if (!profile.url?.trim()) {
      continue;
    }
    const url = profile.url.trim();
    links.push(`\\href{${url}}{${escapeLatex(profilePlatformLabel(profile))}}`);
  }
  return links.map((link) => `{\\textbullet}\n    ${link}`).join('\n    ');
}

type ExperienceEntry = {
  hidden?: boolean;
  role: string;
  organization: string;
  period: string;
  highlights: string[];
};

function buildTrajectoryItems(trajectory: ExperienceEntry[]): string {
  return trajectory
    .filter((item) => !item.hidden)
    .map((item) => {
      const highlights = item.highlights
        .map((highlight) => `            \\item ${escapeLatex(highlight)}`)
        .join('\n');
      return [
        `    \\cventry{${escapeLatex(item.organization)}}{${escapeLatex(item.period)}}{${escapeLatex(item.role)}}{}`,
        '        \\begin{itemize}',
        highlights,
        '        \\end{itemize}',
      ].join('\n');
    })
    .join('\n\n% ------\n\n');
}

function buildOptionalSection(heading: string, body: string): string {
  if (!body.trim()) {
    return '';
  }
  return ['% ------', '', `\\section{${heading}}`, body, ''].join('\n');
}

function buildLeadershipSection(leadership: LeadershipItem[], heading: string): string {
  const visible = leadership.filter((item) => !item.hidden);
  if (visible.length === 0) {
    return '';
  }
  return buildOptionalSection(heading, buildTrajectoryItems(visible));
}

function buildEducationSection(education: EducationItem[], heading: string): string {
  const visible = education.filter((item) => !item.hidden);
  if (visible.length === 0) {
    return '';
  }

  const entries = visible
    .map(
      (item) =>
        `    \\cventry{${escapeLatex(item.institution)}}{${escapeLatex(item.period)}}{${escapeLatex(item.degree)}}{${escapeLatex(item.location)}}`,
    )
    .join('\n\n% ------\n\n');

  return buildOptionalSection(heading, entries);
}

function buildCredentialEntry(item: CredentialItem): string {
  const issuer = item.credentialId?.trim()
    ? `${escapeLatex(item.issuer)} (${escapeLatex(item.credentialId.trim())})`
    : escapeLatex(item.issuer);
  return `    \\cventry{${linkedTitle(item.name, item.url)}}{${escapeLatex(item.period)}}{${issuer}}{}`;
}

function buildCredentialsSection(credentials: CredentialItem[], heading: string): string {
  const visible = credentials.filter((item) => !item.hidden);
  if (visible.length === 0) {
    return '';
  }

  const entries = visible.map(buildCredentialEntry).join('\n\n% ------\n\n');
  return buildOptionalSection(heading, entries);
}

function buildPublicationsSection(publications: PublicationItem[], heading: string): string {
  const visible = publications.filter((item) => !item.hidden && item.includeInPdf);
  if (visible.length === 0) {
    return '';
  }

  const entries = visible.map(buildCredentialEntry).join('\n\n% ------\n\n');
  return buildOptionalSection(heading, entries);
}

function linkedTitle(name: string, url?: string): string {
  const escaped = escapeLatex(name);
  return url?.trim() ? `\\href{${url.trim()}}{${escaped}}` : escaped;
}

function buildEntryWithDescription(
  title: string,
  period: string,
  subtitle: string,
  description?: string,
): string {
  const entry = `    \\cventry{${title}}{${escapeLatex(period)}}{${subtitle}}{}`;
  if (!description?.trim()) {
    return entry;
  }
  return [
    entry,
    '        \\begin{itemize}',
    `            \\item ${escapeLatex(description)}`,
    '        \\end{itemize}',
  ].join('\n');
}

const technicalProductionKindLabels: Record<string, string> = {
  software: 'Software',
  library: 'Library',
  tool: 'Tool',
  dataset: 'Dataset',
};

type DescribedItem = {
  hidden?: boolean;
  includeInPdf?: boolean;
  name: string;
  url?: string;
  period: string;
  description?: string;
};

type ItemSubtitle<T> = (item: T) => string;

function buildDescribedItemsSection<T extends DescribedItem>(
  items: T[],
  heading: string,
  itemSubtitle: ItemSubtitle<T>,
) {
  const entries = items
    .filter((item) => !item.hidden && item.includeInPdf)
    .map((item) =>
      buildEntryWithDescription(
        linkedTitle(item.name, item.url),
        item.period,
        itemSubtitle(item),
        item.description,
      ),
    )
    .join('\n\n% ------\n\n');
  return buildOptionalSection(heading, entries);
}

function buildTechnicalProductionsSection(
  items: TechnicalProductionItem[],
  heading: string,
): string {
  return buildDescribedItemsSection(items, heading, (item) =>
    escapeLatex(technicalProductionKindLabels[item.kind] ?? ''),
  );
}

function buildEventsSection(items: EventItem[], heading: string): string {
  const visible = items.filter((item) => !item.hidden && item.includeInPdf);
  if (visible.length === 0) {
    return '';
  }

  const entries = visible
    .map((item) => {
      const subtitle = [item.talkTitle, item.role]
        .filter((value): value is string => Boolean(value?.trim()))
        .map(escapeLatex)
        .join(' — ');
      return `    \\cventry{${linkedTitle(item.name, item.url)}}{${escapeLatex(item.period)}}{${subtitle}}{${escapeLatex(item.location ?? '')}}`;
    })
    .join('\n\n% ------\n\n');
  return buildOptionalSection(heading, entries);
}

function buildAwardsSection(items: AwardItem[], heading: string): string {
  return buildDescribedItemsSection(items, heading, (item) => escapeLatex(item.issuer));
}

function buildSelectedCases(cases: CaseStudy[]): string {
  return cases
    .map((item) =>
      [
        `    \\cventry{${escapeLatex(item.title)}}{${escapeLatex(item.status ?? '')}}{${escapeLatex(item.meta)}}{}`,
        '        \\begin{itemize}',
        `            \\item ${escapeLatex(item.summary)}`,
        `            \\item ${escapeLatex(item.role)}`,
        `            \\item ${escapeLatex(item.result)}`,
        '        \\end{itemize}',
      ].join('\n'),
    )
    .join('\n\n% ------\n\n');
}

function buildSkillGroups(skills: SkillGroup[]): string {
  return skills
    .map(
      (group) =>
        `        \\item \\textbf{${escapeLatex(group.label)}:} ${group.items.map(escapeLatex).join(', ')}`,
    )
    .join('\n');
}

export function buildLanguagesSection(
  languages: ResumeLanguage[],
  locale: LocaleLanguageLabels,
): string {
  if (languages.length === 0) {
    return '';
  }

  const items = languages
    .map((language) => {
      const name = language.name ?? language.code;
      const proficiency =
        language.proficiency === 'native' ? locale.nativeProficiency : language.proficiency;
      return `        \\item ${escapeLatex(name)}${
        proficiency ? ` (${escapeLatex(proficiency)})` : ''
      }`;
    })
    .join('\n');

  return buildOptionalSection(
    locale.languagesHeading,
    ['    \\begin{itemize}', items, '    \\end{itemize}'].join('\n'),
  );
}

async function buildTexSource(locale: Locale): Promise<string> {
  const {
    cases,
    page: pageTranslation,
    profile: profileTranslation,
    resume: resumeTranslation,
    site,
  } = await contentRuntime.getResumePageContent(locale.code);
  const profile = profileTranslation;
  const skillGroups = resumeTranslation.skills;
  const languages = resumeTranslation.languages;

  const template = await readFile(path.join(templatesDir, locale.templateFile), 'utf8');
  const selectedCases = buildSelectedCases(cases);

  const replacements: Record<string, string> = {
    '%%PDF_TITLE%%': escapeLatex(`${pageTranslation.title} ${profile.name}`),
    '%%PROFILE_NAME%%': escapeLatex(profile.name),
    '%%PROFILE_LOCATION%%': escapeLatex(profileTranslation.location),
    '%%CONTACT_LINKS%%': buildContactLinks(site, await contentRuntime.getContactEmail()),
    '%%SUMMARY%%': escapeLatex(resumeTranslation.summary),
    '%%LEADERSHIP_SECTION%%': buildLeadershipSection(
      resumeTranslation.leadership,
      locale.leadershipHeading,
    ),
    '%%EXPERIENCE_SECTION%%': buildOptionalSection(
      locale.experienceHeading,
      buildTrajectoryItems(profileTranslation.trajectory.filter((item) => item.includeInResume)),
    ),
    '%%SELECTED_CASES%%': selectedCases,
    '%%SKILL_GROUPS%%': buildSkillGroups(skillGroups),
    '%%EDUCATION_SECTION%%': buildEducationSection(
      resumeTranslation.education,
      locale.educationHeading,
    ),
    '%%CERTIFICATES_SECTION%%': buildCredentialsSection(
      resumeTranslation.certificates,
      locale.certificatesHeading,
    ),
    '%%CERTIFICATIONS_SECTION%%': buildCredentialsSection(
      resumeTranslation.certifications,
      locale.certificationsHeading,
    ),
    '%%PUBLICATIONS_SECTION%%': buildPublicationsSection(
      resumeTranslation.publications,
      locale.publicationsHeading,
    ),
    '%%TECHNICAL_PRODUCTIONS_SECTION%%': buildTechnicalProductionsSection(
      resumeTranslation.technicalProductions,
      locale.technicalProductionsHeading,
    ),
    '%%EVENTS_SECTION%%': buildEventsSection(resumeTranslation.events, locale.eventsHeading),
    '%%AWARDS_SECTION%%': buildAwardsSection(resumeTranslation.awards, locale.awardsHeading),
    '%%LANGUAGES_SECTION%%': buildLanguagesSection(languages, locale),
  };

  return Object.entries(replacements).reduce(
    (source, [token, value]) => source.split(token).join(value),
    template,
  );
}

async function runPdfCompiler(sourcePath: string, outputPath: string): Promise<void> {
  const compiler = process.env.PORTFOLIO_PDF_COMPILER;
  if (!compiler) {
    return;
  }
  await new Promise<void>((resolve, reject) => {
    const child = spawn(compiler, [sourcePath, outputPath], { stdio: 'inherit' });
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `PDF compiler exited with status ${code ?? 'null'} and signal ${signal ?? 'none'}.`,
        ),
      );
    });
  });
  process.stdout.write(`Generated ${outputPath}\n`);
}

async function writeTexSource(locale: Locale, texSource: string): Promise<void> {
  const defaultOutputFile = path.join(publicDir, locale.outputFile.replace(/\.pdf$/, '.tex'));
  const outputOption = locale.code === 'en' ? '--output-file-en' : '--output-file-pt-BR';
  const outputPath = path.resolve(process.cwd(), optionValue(outputOption) ?? defaultOutputFile);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, texSource, 'utf8');
  process.stdout.write(`Generated ${outputPath}\n`);
  await runPdfCompiler(outputPath, path.join(publicDir, locale.outputFile));
}

export async function generate() {
  await mkdir(publicDir, { recursive: true });
  await Promise.all(
    selectedLocales().map(async (locale) => {
      const texSource = await buildTexSource(locale);
      await writeTexSource(locale, texSource);
    }),
  );
}

runRegenerationCli({
  moduleUrl: import.meta.url,
  directories: [contentDir, templatesDir],
  regenerate: generate,
  watchMessage: 'Watching résumé PDF inputs...',
  failureMessage: 'Résumé PDF regeneration failed:',
});
