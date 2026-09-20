import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { generateProfileReadme, loadProfileReadmeSource, renderProfileReadme } from '../index.mjs';

const source = {
  profile: {
    name: 'Gabriel Antunes',
    title: 'Solutions developer',
    location: 'Rondônia, Brazil · remote',
    birthCity: 'Ji-Paraná, Rondônia, Brazil',
    description: 'I solve problems with systems, data and tools.',
    interests: '',
    learning: '',
    personalInterests: [],
    trajectory: [],
    milestones: [],
  },
  resume: {
    summary: '',
    skills: [],
    languages: [],
    selectedCases: [],
    leadership: [],
    education: [],
    certificates: [],
    certifications: [],
    publications: [],
    recommendations: [],
    technicalProductions: [],
    events: [],
    awards: [],
  },
  site: {
    shortName: 'GA',
    copyrightTemplate: '',
    maintenanceEnabled: false,
    maintenance: { eyebrow: '', title: '', description: '' },
    contact: { available: false, hasEmail: false, profiles: [] },
  },
  email: '',
};

test('loads profile data from the Laravel public-site API', async () => {
  const previousFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.equal(String(url), 'https://portfolio.example/api/v1/public-site?locale=en');
    return {
      ok: true,
      json: async () => ({
        chrome: {
          copyright: '© 2026',
          profile: {
            name: 'Gabriel Antunes',
            title: 'Solutions developer',
            location: 'Rondônia, Brazil · remote',
            birth_city: 'Ji-Paraná, Rondônia, Brazil',
            description: 'I solve problems with systems, data and tools.',
            personal_interests: ['Coffee and code.'],
          },
          site: {
            short_name: 'GA',
            portfolio_url: 'https://guesant.net',
            contact_available: true,
            contact_profiles: [{ platform: 'github', url: 'https://github.com/guesant' }],
          },
        },
        resume: {
          summary: 'I work across backend systems and infrastructure.',
          skills: [{ name: 'Languages', technologies: [{ name: 'TypeScript' }] }],
          languages: [{ code: 'pt-BR', name: 'Portuguese (Brazil)', proficiency: 'native' }],
        },
      }),
    };
  };

  try {
    const loaded = await loadProfileReadmeSource({
      apiUrl: 'https://portfolio.example/api/v1/public-site',
    });
    assert.equal(loaded.profile.name, 'Gabriel Antunes');
    assert.equal(loaded.resume.languages[0].name, 'Portuguese (Brazil)');
    assert.equal(loaded.site.contact.profiles[0].platform, 'github');
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('renders the public README deterministically', () => {
  const populated = {
    ...source,
    profile: {
      ...source.profile,
      interests: 'Systems and developer tools.',
      learning: 'Computing and mathematics.',
      personalInterests: ['Coffee and code.'],
    },
    resume: {
      ...source.resume,
      summary: 'I work across backend systems and infrastructure.',
      languages: [
        { code: 'pt-BR', name: 'Portuguese (Brazil)', proficiency: 'native' },
        { code: 'en', name: 'English', proficiency: '' },
      ],
      skills: [{ label: 'Languages', items: ['TypeScript', 'Go'] }],
    },
    site: {
      ...source.site,
      portfolioUrl: 'https://portfolio.example.com',
      contact: {
        available: true,
        hasEmail: false,
        profiles: [{ platform: 'github', url: 'https://github.com/guesant' }],
      },
    },
  };

  const rendered = renderProfileReadme(populated);
  assert.match(rendered, /# Hello, my name is Gabriel Antunes/);
  assert.match(rendered, /## Social/);
  assert.match(rendered, /\[GitHub\]\(https:\/\/github\.com\/guesant\)/);
  assert.match(rendered, /## Portfolio/);
  assert.equal(renderProfileReadme(populated), rendered);
});

test('writes only inside the workspace and replaces the file atomically', async () => {
  const workspace = await mkdtemp(path.join(tmpdir(), 'push-profile-'));
  try {
    const result = await generateProfileReadme({
      outputPath: 'profile/README.md',
      workspace,
      source,
    });
    assert.equal(await readFile(result.destination, 'utf8'), result.readme);
    await assert.rejects(
      () => generateProfileReadme({ outputPath: '../README.md', workspace, source }),
      /inside GITHUB_WORKSPACE/,
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
