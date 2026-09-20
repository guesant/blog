import { readFileSync } from 'node:fs';
import path from 'node:path';

export type AuditedRoute = {
  path: string;
  locale: 'en' | 'pt-BR';
};

type RouteManifest = { routes: string[] };

const manifestPath = path.join(process.cwd(), 'audits/audited-routes.json');

function readManifest(): RouteManifest {
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8')) as RouteManifest;
  } catch {
    throw new Error(
      `No route manifest at ${manifestPath}. Run "just audit" first, ` +
        'since every audit target already depends on it.',
    );
  }
}

function toPortuguese(route: string): string {
  return route === '/' ? '/pt-BR' : `/pt-BR${route}`;
}

const { routes } = readManifest();

export const auditedRoutes: AuditedRoute[] = [
  ...routes.map((route) => ({ path: route, locale: 'en' as const })),
  ...routes.map((route) => ({ path: toPortuguese(route), locale: 'pt-BR' as const })),
];
