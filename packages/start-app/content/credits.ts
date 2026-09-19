import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getCredits, getCreditsPageCopy } from '@portfolio/content/server';
import type { CreditsPageContent, PackageCredit } from '@portfolio/content/types';
import packageJson from '../package.json';

type DependencyVersions = Record<string, string>;
type RepositoryMetadata = { url?: unknown };
type AuthorMetadata = { name?: unknown };

function repositoryMetadata(repository: unknown): RepositoryMetadata | undefined {
  if (!repository || typeof repository !== 'object' || !('url' in repository)) {
    return undefined;
  }
  return repository as RepositoryMetadata;
}

function repositoryValue(repository: unknown) {
  if (typeof repository === 'string') {
    return repository;
  }
  return String(repositoryMetadata(repository)?.url ?? '');
}

function normalizeRepositoryUrl(repository: unknown): string | undefined {
  const raw = repositoryValue(repository).trim();
  if (!raw) {
    return undefined;
  }
  return raw
    .replace(/^git\+/, '')
    .replace(/^git:\/\//, 'https://')
    .replace(/\.git$/, '');
}

function authorName(author: unknown): string | undefined {
  if (!author || typeof author !== 'object' || !('name' in author)) {
    return undefined;
  }
  const name = (author as AuthorMetadata).name;
  return typeof name === 'string' ? name : undefined;
}

function normalizeAuthor(author: unknown): string | undefined {
  const name = typeof author === 'string' ? author : authorName(author);
  return name?.replace(/\s*[<(].*$/, '').trim() || undefined;
}

async function packageMeta(name: string): Promise<Partial<PackageCredit>> {
  try {
    const meta = JSON.parse(
      await readFile(path.join(process.cwd(), 'node_modules', name, 'package.json'), 'utf8'),
    ) as {
      description?: string;
      license?: string | { type?: string };
      author?: unknown;
      repository?: unknown;
    };
    return {
      description: meta.description,
      license: typeof meta.license === 'string' ? meta.license : meta.license?.type,
      author: normalizeAuthor(meta.author),
      repositoryUrl: normalizeRepositoryUrl(meta.repository),
    };
  } catch {
    return {};
  }
}

async function packageCredits(dependencies: DependencyVersions = {}): Promise<PackageCredit[]> {
  return Promise.all(
    Object.entries(dependencies)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(async ([name, version]) => ({ name, version, ...(await packageMeta(name)) })),
  );
}

export async function getCreditsPageContent(locale?: string): Promise<CreditsPageContent> {
  const [page, credits, libraries, tools] = await Promise.all([
    getCreditsPageCopy(locale),
    getCredits(locale),
    packageCredits(packageJson.dependencies),
    packageCredits(packageJson.devDependencies),
  ]);
  return { page, credits, libraries, tools };
}
